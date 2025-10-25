/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

interface TrafficRoute {
  id: string;
  roadName: string;
  trafficVolume: number | null;
}

enum AccidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

@Injectable()
@Processor('simulation-queue')
export class AccidentsProcessor extends WorkerHost {
  private readonly logger = new Logger(AccidentsProcessor.name);
  private readonly gisServerUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    super();
    const url = this.configService.get<string>('GIS_SERVER_URL');
    if (!url) throw new Error('GIS_SERVER_URL is not defined in configuration');
    this.gisServerUrl = url;
  }

  async process(job: Job<unknown, any, string>): Promise<any> {
    switch (job.name) {
      case 'simulate-traffic-volume':
        return this.handleSimulateTrafficVolume(job);
      case 'simulate-daily-accidents':
        return this.handleSimulateDailyAccidents(job);
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  }

  private async handleSimulateTrafficVolume(job: Job<unknown, any, string>) {
    this.logger.log(`--- [${job.name}] Starting Job ---`);
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
        let roadTypeMultiplier = 1.0;
        const roadNameLower = route.roadName.toLowerCase();
        if (
          roadNameLower.includes('đại lộ') ||
          roadNameLower.includes('xa lộ') ||
          roadNameLower.includes('cao tốc')
        ) {
          roadTypeMultiplier = 2.5;
        } else if (
          roadNameLower.includes('hẻm') ||
          roadNameLower.includes('ngõ')
        ) {
          roadTypeMultiplier = 0.2;
        }

        let baseVolume: number;
        if (
          (currentHour >= 7 && currentHour < 10) ||
          (currentHour >= 17 && currentHour < 20)
        ) {
          baseVolume = 8000;
        } else if (currentHour >= 0 && currentHour < 6) {
          baseVolume = 400;
        } else {
          baseVolume = 3000;
        }

        const adjustedBaseVolume = baseVolume * roadTypeMultiplier;
        const randomFactor = 0.8 + Math.random() * 0.4;
        const newTrafficVolume = Math.round(adjustedBaseVolume * randomFactor);
        await this.patchToGis(`/traffics/${route.id}`, {
          trafficVolume: newTrafficVolume,
        });
        updatedCount++;
      }
      this.logger.log(
        `--- [${job.name}] Finished Job. Updated ${updatedCount} routes. ---`,
      );
    } catch (error) {
      this.logger.error(`[${job.name}] Failed to run job`, error.stack);
      throw error;
    }
  }

  private async handleSimulateDailyAccidents(job: Job<unknown, any, string>) {
    this.logger.log(`--- [${job.name}] Starting Job ---`);
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
          const accidentProbability = trafficVolume / 80000;
          if (Math.random() < accidentProbability) {
            const severity = this.getRandomSeverity();
            const casualties = this.getCasualtiesBasedOnSeverity(severity);
            const newAccident = {
              trafficId: route.id,
              accidentDate: new Date().toISOString(),
              severity: severity,
              casualties: casualties,
            };
            await this.postToGis('/accidents', newAccident);
            this.logger.warn(
              `>>> Simulated a ${severity} accident on route: "${route.roadName}" (ID: ${route.id})`,
            );
            simulatedCount++;
          }
        }
      }
      this.logger.log(
        `--- [${job.name}] Finished Job. Simulated ${simulatedCount} new accidents. ---`,
      );
    } catch (error) {
      this.logger.error(`[${job.name}] Failed to run job`, error.stack);
      throw error;
    }
  }

  private getRandomSeverity(): AccidentSeverity {
    const rand = Math.random();
    if (rand < 0.02) return AccidentSeverity.CRITICAL;
    if (rand < 0.1) return AccidentSeverity.HIGH;
    if (rand < 0.4) return AccidentSeverity.MEDIUM;
    return AccidentSeverity.LOW;
  }

  private getCasualtiesBasedOnSeverity(severity: AccidentSeverity): number {
    const rand = Math.random();
    switch (severity) {
      case AccidentSeverity.CRITICAL:
        return Math.floor(rand * 3) + 2;
      case AccidentSeverity.HIGH:
        return rand < 0.8 ? Math.floor(rand * 2) + 1 : 0;
      case AccidentSeverity.MEDIUM:
        return rand < 0.3 ? 1 : 0;
      case AccidentSeverity.LOW:
        return rand < 0.05 ? 1 : 0;
      default:
        return 0;
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
