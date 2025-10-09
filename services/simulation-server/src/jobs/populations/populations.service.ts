/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

interface District {
  id: string;
  name: string;
}

interface PopulationRecord {
  id: string;
  year: number;
  populationTotal: number;
  householdsTotal: number;
}

@Injectable()
export class PopulationsJobService {
  private readonly logger = new Logger(PopulationsJobService.name);
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

  @Cron(CronExpression.EVERY_10_HOURS)
  async simulateYearlyPopulationGrowth() {
    this.logger.log('--- Starting Yearly Population Simulation Job ---');
    try {
      const districts = await this.fetchFromGis<District[]>('/districts');
      this.logger.log(`Found ${districts.length} districts to process.`);
      const currentYear = new Date().getFullYear();
      let simulatedCount = 0;
      for (const district of districts) {
        const populationHistory = await this.fetchFromGis<PopulationRecord[]>(
          `/populations?districtId=${district.id}`,
        );
        if (populationHistory.length > 0) {
          const latestRecord = populationHistory[0];
          if (latestRecord.year < currentYear) {
            const growthRate = 1 + (Math.random() * 0.02 + 0.015);
            const newPopulationTotal = Math.floor(
              latestRecord.populationTotal * growthRate,
            );
            const newHouseholdsTotal = Math.floor(newPopulationTotal / 3.5);
            const newPopulationDto = {
              year: currentYear,
              populationTotal: newPopulationTotal,
              householdsTotal: newHouseholdsTotal,
              districtId: district.id,
            };
            await this.postToGis('/populations', newPopulationDto);
            this.logger.log(
              `Simulated population for "${district.name}" in ${currentYear}: ${newPopulationTotal}`,
            );
            simulatedCount++;
          } else {
            this.logger.log(
              `Data for "${district.name}" in ${currentYear} already exists. Skipping.`,
            );
          }
        } else {
          this.logger.warn(
            `No existing population data for "${district.name}". Skipping simulation.`,
          );
        }
      }
      this.logger.log(
        `--- Finished Population Simulation Job. Simulated data for ${simulatedCount} districts. ---`,
      );
    } catch (error) {
      this.logger.error(
        'Failed to run population simulation job',
        error.response?.data || error.message,
      );
    }
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
