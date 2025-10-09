/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

interface TrafficRoute {
  id: string;
  roadName: string;
  trafficVolume: number | null;
}

@Injectable()
export class AccidentsJobService {
  private readonly logger = new Logger(AccidentsJobService.name);
  private readonly gisServerUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const url = this.configService.get<string>('GIS_SERVER_URL');
    if (!url) {
      throw new Error('GIS_SERVER_URL is not defined in configuration');
    }
    this.gisServerUrl = url;
  }

  @Cron(CronExpression.EVERY_HOUR)
  async simulateTrafficVolume() {
    this.logger.log('--- Starting Traffic Volume Simulation Job ---');
    try {
      const allRoutes = await this.fetchFromGis<TrafficRoute[]>('/traffics');
      if (!allRoutes || allRoutes.length === 0) {
        this.logger.warn(
          'No traffic routes found to simulate volume. Skipping job.',
        );
        return;
      }

      const currentHour = new Date().getHours();
      let updatedCount = 0;

      for (const route of allRoutes) {
        let baseVolume: number;
        if (
          (currentHour >= 7 && currentHour < 10) ||
          (currentHour >= 17 && currentHour < 20)
        ) {
          baseVolume = 10000;
        } else if (currentHour >= 0 && currentHour < 6) {
          baseVolume = 500;
        } else {
          baseVolume = 4000;
        }

        const randomFactor = 0.8 + Math.random() * 0.4;
        const newTrafficVolume = Math.round(baseVolume * randomFactor);

        await this.patchToGis(`/traffics/${route.id}`, {
          trafficVolume: newTrafficVolume,
        });
        this.logger.debug(
          `Updated traffic volume for "${route.roadName}" to ${newTrafficVolume} at hour ${currentHour}.`,
        );
        updatedCount++;
      }
      this.logger.log(
        `--- Finished Traffic Volume Simulation Job. Updated ${updatedCount} routes. ---`,
      );
    } catch (error) {
      this.logger.error(
        'Failed to run traffic volume simulation job',
        error.stack,
      );
    }
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async simulateDailyAccidents() {
    this.logger.log('--- Starting Accident Simulation Job ---');
    try {
      const allRoutes = await this.fetchFromGis<TrafficRoute[]>('/traffics');
      if (!allRoutes || allRoutes.length === 0) {
        this.logger.warn(
          'No traffic routes found to simulate accidents on. Skipping job.',
        );
        return;
      }

      let simulatedCount = 0;
      for (const route of allRoutes) {
        const trafficVolume = route.trafficVolume || 0;
        if (trafficVolume > 1000) {
          const accidentProbability = trafficVolume / 50000;
          this.logger.debug(
            `Route: "${route.roadName}", Volume: ${trafficVolume}, Accident Probability: ${accidentProbability.toFixed(4)}`,
          );
          if (Math.random() < accidentProbability) {
            const newAccident = {
              trafficId: route.id,
              accidentDate: new Date().toISOString(),
              severity:
                Math.random() < 0.7 ? 'Ít nghiêm trọng' : 'Nghiêm trọng',
              casualties:
                Math.random() < 0.4 ? Math.floor(Math.random() * 2) + 1 : 0,
            };
            await this.postToGis('/accidents', newAccident);
            this.logger.warn(
              `>>> Simulated an accident on route: "${route.roadName}" (ID: ${route.id})`,
            );
            simulatedCount++;
          }
        }
      }
      this.logger.log(
        `--- Finished Accident Simulation Job. Simulated ${simulatedCount} new accidents. ---`,
      );
    } catch (error) {
      this.logger.error('Failed to run accident simulation job', error.stack);
    }
  }

  private handleError(error: AxiosError, context: string) {
    if (error.response) {
      this.logger.error(
        `[${context}] Server responded with status ${error.response.status}`,
        JSON.stringify(error.response.data, null, 2),
      );
    } else if (error.request) {
      this.logger.error(
        `[${context}] No response received. Is the server running at ${this.gisServerUrl}?`,
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

  private async patchToGis(endpoint: string, data: any): Promise<any> {
    const url = `${this.gisServerUrl}${endpoint}`;
    try {
      const response = await firstValueFrom(this.httpService.patch(url, data));
      return response.data;
    } catch (error) {
      this.handleError(error, `patchToGis: ${endpoint}`);
      throw error;
    }
  }
}
