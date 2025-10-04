/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

interface MonitoringStation {
  id: string;
  geom: {
    type: 'Point';
    coordinates: [number, number];
  };
  districtId: string;
}

interface District {
  id: string;
  name: string;
}

interface WeatherData {
  current: {
    wind_kph: number;
    precip_mm: number;
    humidity: number;
    cloud: number;
  };
}

@Injectable()
export class EnvironmentJobService {
  private readonly logger = new Logger(EnvironmentJobService.name);
  private readonly gisServerUrl: string;
  private readonly weatherApiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const gisServerUrl = this.configService.get<string>('GIS_SERVER_URL');
    const weatherApiKey = this.configService.get<string>('WEATHER_API_KEY');
    if (!gisServerUrl) {
      throw new Error('GIS_SERVER_URL is not defined in configuration');
    }
    if (!weatherApiKey) {
      throw new Error('WEATHER_API_KEY is not defined in configuration');
    }
    this.gisServerUrl = gisServerUrl;
    this.weatherApiKey = weatherApiKey;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async simulateEnvironmentalData() {
    this.logger.log(
      '--- Starting Hourly Environmental Data Simulation Job ---',
    );
    try {
      const stations = await this.ensureMonitoringStationsExist();

      if (stations.length === 0) {
        this.logger.error(
          'No monitoring stations found and failed to initialize. Skipping job.',
        );
        return;
      }

      this.logger.log(
        `Found ${stations.length} unique monitoring locations to process.`,
      );

      for (const location of stations) {
        try {
          const weatherData = await this.getWeatherData(
            location.lat,
            location.lng,
          );
          const now = new Date().toISOString();

          const simulatedAirData = this.simulateAirQuality(weatherData);
          await this.postToGis('/air-qualities', {
            geom: `POINT(${location.lng} ${location.lat})`,
            ...simulatedAirData,
            recordedAt: now,
            districtId: location.districtId,
          });

          const simulatedWaterData = this.simulateWaterQuality(weatherData);
          await this.postToGis('/water-qualities', {
            geom: `POINT(${location.lng} ${location.lat})`,
            ...simulatedWaterData,
            recordedAt: now,
            districtId: location.districtId,
          });

          this.logger.log(
            `Simulated environmental data for location (${location.lng}, ${location.lat}) in district ${location.districtId}`,
          );
        } catch (innerError) {
          this.logger.error(
            `Failed to process location (${location.lng}, ${location.lat})`,
            innerError.message,
          );
        }
      }
      this.logger.log('--- Finished Environmental Data Simulation Job. ---');
    } catch (error) {
      this.logger.error(
        'A critical error occurred in the simulation job.',
        error.stack,
      );
    }
  }

  private async ensureMonitoringStationsExist(): Promise<
    { lat: number; lng: number; districtId: string }[]
  > {
    const airStations =
      await this.fetchFromGis<MonitoringStation[]>('/air-qualities');
    const waterStations =
      await this.fetchFromGis<MonitoringStation[]>('/water-qualities');

    let allStations = [...airStations, ...waterStations];

    if (allStations.length === 0) {
      this.logger.warn(
        'No monitoring stations found. Attempting to initialize default stations...',
      );
      await this.initializeDefaultStations();

      this.logger.log('Waiting for 2 seconds for data to propagate...');
      await this.sleep(2000);

      this.logger.log('Re-fetching stations after initialization...');
      const newAirStations =
        await this.fetchFromGis<MonitoringStation[]>('/air-qualities');
      const newWaterStations =
        await this.fetchFromGis<MonitoringStation[]>('/water-qualities');
      allStations = [...newAirStations, ...newWaterStations];
    }

    return this.getUniqueLocations(allStations);
  }

  private async initializeDefaultStations() {
    const defaultStationCoordinates = [
      {
        type: 'air',
        lng: 106.701,
        lat: 10.776,
        data: { pm25: 38.5, co2: 410.2, no2: 18.5 },
      },
      {
        type: 'air',
        lng: 106.695,
        lat: 10.78,
        data: { pm25: 42.1, co2: 415.8, no2: 22.1 },
      },
      {
        type: 'water',
        lng: 106.705,
        lat: 10.77,
        data: { ph: 7.2, turbidity: 20, contaminationIndex: 2.1 },
      },
    ];

    const now = new Date().toISOString();
    let initializedCount = 0;

    for (const station of defaultStationCoordinates) {
      try {
        const district = await this.fetchFromGis<District>(
          `/districts/contains-point?lng=${station.lng}&lat=${station.lat}`,
        );

        if (!district) {
          this.logger.warn(
            `Skipping station at (${station.lng}, ${station.lat}) as it does not belong to any district.`,
          );
          continue;
        }

        if (station.type === 'air') {
          await this.postToGis('/air-qualities', {
            geom: `POINT(${station.lng} ${station.lat})`,
            ...station.data,
            recordedAt: now,
            districtId: district.id,
          });
        } else if (station.type === 'water') {
          await this.postToGis('/water-qualities', {
            geom: `POINT(${station.lng} ${station.lat})`,
            ...station.data,
            recordedAt: now,
            districtId: district.id,
          });
        }
        this.logger.log(
          `Initialized sample ${station.type} station in "${district.name}"`,
        );
        initializedCount++;
      } catch (error) {
        if (error.status === 404) {
          this.logger.warn(
            `Skipping station at (${station.lng}, ${station.lat}) as it does not belong to any district.`,
          );
        } else {
          this.logger.error(
            `Failed to initialize station at (${station.lng}, ${station.lat})`,
            error.response?.data || error.message,
          );
        }
      }
    }
    this.logger.log(
      `Initialization complete. ${initializedCount} stations created.`,
    );
  }

  private simulateAirQuality(weather: WeatherData) {
    const windEffect = 1 - (Math.min(weather.current.wind_kph, 30) / 30) * 0.6;
    const humidityEffect = 1 + (weather.current.humidity / 100) * 0.2;
    const basePm25 = 35;
    const pm25 =
      basePm25 * windEffect * humidityEffect + (Math.random() * 10 - 5);
    const co2 = 410 + (Math.random() * 20 - 10);
    const no2 = 20 + (Math.random() * 15 - 7.5);

    return {
      pm25: parseFloat(pm25.toFixed(2)),
      co2: parseFloat(co2.toFixed(2)),
      no2: parseFloat(no2.toFixed(2)),
    };
  }

  private simulateWaterQuality(weather: WeatherData) {
    const rainEffect = weather.current.precip_mm > 0.1 ? 25 : 5;
    const turbidity = 10 + rainEffect + Math.random() * 10;
    const ph =
      7.0 - weather.current.precip_mm * 0.1 + (Math.random() * 0.4 - 0.2);
    const contaminationIndex = 1 + Math.random() * 3;

    return {
      ph: parseFloat(ph.toFixed(2)),
      turbidity: parseFloat(turbidity.toFixed(2)),
      contaminationIndex: parseFloat(contaminationIndex.toFixed(2)),
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private getUniqueLocations(
    stations: MonitoringStation[],
  ): { lat: number; lng: number; districtId: string }[] {
    const unique = new Map<
      string,
      { lat: number; lng: number; districtId: string }
    >();
    stations.forEach((station) => {
      if (station.geom && station.geom.coordinates) {
        const [lng, lat] = station.geom.coordinates;
        const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
        if (!unique.has(key)) {
          unique.set(key, { lat, lng, districtId: station.districtId });
        }
      }
    });
    return Array.from(unique.values());
  }

  private async getWeatherData(lat: number, lon: number): Promise<WeatherData> {
    const url = `http://api.weatherapi.com/v1/current.json?key=${this.weatherApiKey}&q=${lat},${lon}&aqi=no`;
    const response = await firstValueFrom(
      this.httpService.get<WeatherData>(url),
    );
    return response.data;
  }

  private handleError(error: AxiosError, context: string) {
    if (error.response) {
      this.logger.error(
        `[${context}] GIS Server responded with status ${error.response.status}`,
        JSON.stringify(error.response.data, null, 2),
      );
    } else if (error.request) {
      this.logger.error(
        `[${context}] No response received from GIS Server. Is it running at ${this.gisServerUrl}?`,
      );
    } else {
      this.logger.error(
        `[${context}] Error setting up request:`,
        error.message,
      );
    }
  }

  private async fetchFromGis<T>(endpoint: string): Promise<T> {
    const url = `${this.gisServerUrl}${endpoint}`;
    try {
      const response = await firstValueFrom(this.httpService.get<T>(url));
      return response.data;
    } catch (error) {
      this.handleError(error, `fetchFromGis: ${endpoint}`);
      throw error;
    }
  }

  private async postToGis(endpoint: string, data: any): Promise<any> {
    const url = `${this.gisServerUrl}${endpoint}`;
    try {
      const response = await firstValueFrom(this.httpService.post(url, data));
      return response.data;
    } catch (error) {
      this.handleError(error, `postToGis: ${endpoint}`);
      throw error;
    }
  }
}
