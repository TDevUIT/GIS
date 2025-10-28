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
  sourceUrl: string;
  scrapedAt: string;
}

interface CleanedAccidentData extends RawAccidentData {
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface FinalAccidentData extends CleanedAccidentData {
  geom: {
    type: 'Point';
    coordinates: [number, number];
  } | null;
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
    const coordinates = await this.geocodeLocation(msg.location);
    const finalData: FinalAccidentData = {
      ...msg,
      geom: coordinates
        ? { type: 'Point', coordinates: [coordinates.lng, coordinates.lat] }
        : null,
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

    if (!msg.geom) {
      this.logger.warn(
        `[DB Writer] Skipping write for accident without coordinates: ${msg.sourceUrl}`,
      );
      return;
    }

    try {
      const payload = {
        accidentDate: msg.dateTime,
        severity: msg.severity,
        casualties: msg.casualties.fatalities + msg.casualties.injuries,
        description: msg.description,
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
      throw error;
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
    this.logger.log(`Geocoding location: "${location}"`);
    if (location) {
      return {
        lat: 10.7769 + (Math.random() - 0.5) * 0.1,
        lng: 106.7009 + (Math.random() - 0.5) * 0.1,
      };
    }
    return null;
  }
}
