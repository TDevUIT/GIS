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
  geom: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
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

  @Cron(CronExpression.EVERY_30_MINUTES)
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
    const airStationsData =
      await this.fetchFromGis<MonitoringStation[]>('/air-qualities');
    const waterStationsData =
      await this.fetchFromGis<MonitoringStation[]>('/water-qualities');
    const airStations = Array.isArray(airStationsData) ? airStationsData : [];
    const waterStations = Array.isArray(waterStationsData)
      ? waterStationsData
      : [];
    let allStations = [...airStations, ...waterStations];
    if (allStations.length === 0) {
      this.logger.warn(
        'No monitoring stations found. Attempting to initialize default stations...',
      );
      await this.initializeDefaultStations();
      this.logger.log('Waiting for 2 seconds for data to propagate...');
      await this.sleep(2000);
      this.logger.log('Re-fetching stations after initialization...');
      const newAirStationsData =
        await this.fetchFromGis<MonitoringStation[]>('/air-qualities');
      const newWaterStationsData =
        await this.fetchFromGis<MonitoringStation[]>('/water-qualities');
      const newAirStations = Array.isArray(newAirStationsData)
        ? newAirStationsData
        : [];
      const newWaterStations = Array.isArray(newWaterStationsData)
        ? newWaterStationsData
        : [];
      allStations = [...newAirStations, ...newWaterStations];
    }
    return this.getUniqueLocations(allStations);
  }

  private async initializeDefaultStations() {
    this.logger.log(
      'Fetching districts from GIS Server to create sample stations...',
    );
    const districts = await this.fetchFromGis<District[]>('/districts');
    if (!districts || districts.length === 0) {
      this.logger.error(
        'No districts found on GIS Server. Cannot initialize default stations. Please add district data first.',
      );
      return;
    }
    this.logger.log(
      `Found ${districts.length} districts. Will create sample data within them.`,
    );
    const sampleDataConfig = [
      { type: 'air', data: { pm25: 38.5, co2: 410.2, no2: 18.5 } },
      { type: 'air', data: { pm25: 42.1, co2: 415.8, no2: 22.1 } },
      {
        type: 'water',
        data: { ph: 7.2, turbidity: 20, contaminationIndex: 2.1 },
      },
    ];
    const now = new Date().toISOString();
    let initializedCount = 0;
    for (let i = 0; i < sampleDataConfig.length; i++) {
      const sample = sampleDataConfig[i];
      const district = districts[i % districts.length];
      try {
        const firstCoord = district.geom?.coordinates[0][0];
        if (
          !firstCoord ||
          !Array.isArray(firstCoord) ||
          firstCoord.length < 2 ||
          typeof firstCoord[0] !== 'number' ||
          typeof firstCoord[1] !== 'number'
        ) {
          this.logger.warn(
            `Skipping sample for district "${district.name}" due to invalid geometry data.`,
          );
          continue;
        }
        const lng: number = firstCoord[0];
        const lat: number = firstCoord[1];
        const payload = {
          geom: `POINT(${lng} ${lat})`,
          ...sample.data,
          recordedAt: now,
          districtId: district.id,
        };
        if (sample.type === 'air') {
          await this.postToGis('/air-qualities', payload);
        } else if (sample.type === 'water') {
          await this.postToGis('/water-qualities', payload);
        }
        this.logger.log(
          `Initialized sample ${sample.type} station in "${
            district.name
          }" at (${lng.toFixed(4)}, ${lat.toFixed(4)})`,
        );
        initializedCount++;
      } catch (error) {
        this.logger.error(
          `Failed to initialize station for district "${district.name}"`,
          error.response?.data || error.message,
        );
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
      const response = await firstValueFrom(
        this.httpService.get<{ data: T }>(url),
      );
      return response.data.data;
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
