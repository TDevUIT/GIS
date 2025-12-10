/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/require-await */
import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

interface RawAccidentData {
  location: string;
  dateTime: string;
  description: string;
  casualties: { fatalities: number; injuries: number };
  vehiclesInvolved: string[];
  coordinates?: { lat: number; lng: number } | null;
  geom?: string | null; // PostGIS POINT format
  sourceUrl: string;
  scrapedAt: string;
}

interface CleanedAccidentData extends RawAccidentData {
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface FinalAccidentData extends CleanedAccidentData {
  trafficId: string | null;
  // geom is inherited from CleanedAccidentData (PostGIS POINT string format)
}

@Injectable()
export class AccidentProcessingService {
  private readonly logger = new Logger(AccidentProcessingService.name);
  private readonly gisServerUrl: string;

  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const gisUrl = this.configService.get<string>('GIS_SERVER_URL');
    if (!gisUrl) {
      this.logger.error('Missing required configuration: GIS_SERVER_URL');
      throw new Error('Missing required configuration: GIS_SERVER_URL');
    }
    this.gisServerUrl = gisUrl;
  }

  @RabbitSubscribe({
    exchange: 'amq.topic',
    routingKey: 'accident.raw_data',
    queue: 'q.accident.raw_data_processor',
  })
  public async handleRawData(msg: RawAccidentData) {
    this.logger.log(`[AI Agent] Received raw data: ${msg.sourceUrl}`);
    const severity = this.determineSeverity(msg);
    const cleanedData: CleanedAccidentData = { ...msg, severity };
    void this.amqpConnection.publish(
      'amq.topic',
      'accident.cleaned_data',
      cleanedData,
    );
    this.logger.log(`[AI Agent] Published cleaned data for: ${msg.sourceUrl}`);
  }

  @RabbitSubscribe({
    exchange: 'amq.topic',
    routingKey: 'accident.cleaned_data',
    queue: 'q.accident.cleaned_data_processor',
  })
  public async handleCleanedData(msg: CleanedAccidentData) {
    this.logger.log(`[GIS Processor] Received cleaned data: ${msg.sourceUrl}`);

    // Use coordinates from scraper if available, otherwise try geocoding
    let coordinates = msg.coordinates;
    if (!coordinates && msg.location) {
      this.logger.log(
        `[GIS Processor] No coordinates from scraper, attempting geocoding...`,
      );
      coordinates = await this.geocodeLocation(msg.location);
    }

    if (coordinates) {
      this.logger.log(
        `[GIS Processor] Using coordinates: lat=${coordinates.lat}, lng=${coordinates.lng}`,
      );
    } else {
      this.logger.warn(
        `[GIS Processor] No coordinates available for: ${msg.sourceUrl}`,
      );
    }

    let trafficId: string | null = null;
    if (coordinates) {
      trafficId = await this.findTrafficIdByGeom(
        coordinates.lng,
        coordinates.lat,
      );
    }

    // Convert coordinates to PostGIS POINT format if not already present
    const geom =
      msg.geom ||
      (coordinates ? `POINT(${coordinates.lng} ${coordinates.lat})` : null);

    const finalData: FinalAccidentData = {
      ...msg,
      geom: geom,
      trafficId: trafficId,
    };
    void this.amqpConnection.publish(
      'amq.topic',
      'accident.final_data',
      finalData,
    );
    this.logger.log(
      `[GIS Processor] Published final data for: ${msg.sourceUrl}`,
    );
  }

  @RabbitSubscribe({
    exchange: 'amq.topic',
    routingKey: 'accident.final_data',
    queue: 'q.accident.final_data_processor',
  })
  public async handleFinalData(msg: FinalAccidentData) {
    this.logger.log(
      `[DB Writer] Received final data, writing to DB: ${msg.sourceUrl}`,
    );
    if (!msg.geom || !msg.trafficId) {
      this.logger.warn(
        `[DB Writer] Skipping write for accident without coordinates or trafficId: ${msg.sourceUrl}`,
      );
      return;
    }
    try {
      const payload = {
        accidentDate: msg.dateTime,
        severity: msg.severity,
        casualties: msg.casualties.fatalities + msg.casualties.injuries,
        description: msg.description,
        sourceUrl: msg.sourceUrl,
        trafficId: msg.trafficId,
        geom: msg.geom,
      };
      await firstValueFrom(
        this.httpService.post(`${this.gisServerUrl}/accidents`, payload),
      );
      this.logger.log(
        `[DB Writer] Successfully wrote to DB for: ${msg.sourceUrl}`,
      );
    } catch (error) {
      this.logger.error(
        `[DB Writer] Failed to write to DB for: ${msg.sourceUrl}`,
        error.response?.data || error.message,
      );
    }
  }

  private determineSeverity(
    data: RawAccidentData,
  ): CleanedAccidentData['severity'] {
    const { fatalities, injuries } = data.casualties;
    const description = data.description.toLowerCase();
    if (fatalities > 1 || description.includes('thảm khốc')) {
      return 'CRITICAL';
    }
    if (
      fatalities === 1 ||
      injuries > 3 ||
      description.includes('nghiêm trọng')
    ) {
      return 'HIGH';
    }
    if (injuries > 0 || description.includes('bị thương')) {
      return 'MEDIUM';
    }
    return 'LOW';
  }

  private async geocodeLocation(
    location: string,
  ): Promise<{ lat: number; lng: number } | null> {
    this.logger.log(`[Geocoder] Geocoding location: "${location}"`);

    try {
      // Use Nominatim API as fallback
      const encodedLocation = encodeURIComponent(location);
      const url = `https://nominatim.openstreetmap.org/search?q=${encodedLocation}&format=json&limit=1&countrycodes=vn`;

      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'User-Agent': 'IE402-Processing-Service/1.0',
          },
        }),
      );

      if (Array.isArray(response.data) && response.data.length > 0) {
        const result = response.data[0] as { lat: string; lon: string };
        const coordinates = {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
        };
        this.logger.log(
          `[Geocoder] Successfully geocoded to: ${coordinates.lat}, ${coordinates.lng}`,
        );
        return coordinates;
      }

      this.logger.warn(`[Geocoder] No results found for: ${location}`);
      return null;
    } catch (error) {
      this.logger.error(
        `[Geocoder] Geocoding failed for: ${location}`,
        error.response?.data || error.message,
      );
      return null;
    }
  }

  private async findTrafficIdByGeom(
    lng: number,
    lat: number,
  ): Promise<string | null> {
    try {
      const url = `${this.gisServerUrl}/traffics/find-by-location?lng=${lng}&lat=${lat}`;
      const response = await firstValueFrom(this.httpService.get(url));
      this.logger.log(
        `[GIS Processor] Found nearest traffic: ${response.data.id} for location (${lng}, ${lat})`,
      );
      return response.data.id;
    } catch (error) {
      this.logger.warn(
        `Could not find traffic ID for location (${lng}, ${lat})`,
        error.response?.data?.message || error.message,
      );
      return null;
    }
  }
}
