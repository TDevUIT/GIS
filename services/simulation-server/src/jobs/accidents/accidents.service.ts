/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

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
      const allRoutes = await this.fetchTrafficRoutes();
      if (!allRoutes || allRoutes.length === 0) {
        this.logger.log('No traffic routes found to simulate.');
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

        await this.updateTrafficVolume(route.id, newTrafficVolume);
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
        error.response?.data || error.message,
      );
    }
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async simulateDailyAccidents() {
    this.logger.log('--- Starting Accident Simulation Job ---');
    try {
      const allRoutes = await this.fetchTrafficRoutes();
      if (!allRoutes || allRoutes.length === 0) {
        this.logger.log('No traffic routes found to simulate accidents on.');
        return;
      }

      let simulatedCount = 0;
      for (const route of allRoutes) {
        const trafficVolume = route.trafficVolume || 0;
        if (trafficVolume > 1000) {
          const accidentProbability = trafficVolume / 50000;
          this.logger.debug(
            `Route: "${route.roadName}", Volume: ${trafficVolume}, Accident Probability: ${accidentProbability.toFixed(3)}`,
          );
          if (Math.random() < accidentProbability) {
            const accidentDto = {
              trafficId: route.id,
              accidentDate: new Date().toISOString(),
              severity:
                Math.random() < 0.7 ? 'Ít nghiêm trọng' : 'Nghiêm trọng',
              casualties:
                Math.random() < 0.4 ? Math.floor(Math.random() * 2) + 1 : 0,
            };
            await this.createAccident(accidentDto);
            this.logger.warn(
              `>>> Simulated an accident on route: "${route.roadName}" (ID: ${route.id})`,
            );
            simulatedCount++;
          }
        }
      }
      this.logger.log(
        `--- Finished Accident Simulation Job. Simulated ${simulatedCount} accidents. ---`,
      );
    } catch (error) {
      this.logger.error(
        'Failed to run accident simulation job',
        error.response?.data || error.message,
      );
    }
  }

  private async fetchTrafficRoutes(): Promise<TrafficRoute[]> {
    const url = `${this.gisServerUrl}/traffics`;
    const response = await firstValueFrom(
      this.httpService.get<TrafficRoute[]>(url),
    );
    return response.data;
  }

  private async createAccident(data: any): Promise<void> {
    const url = `${this.gisServerUrl}/accidents`;
    await firstValueFrom(this.httpService.post(url, data));
  }

  private async updateTrafficVolume(
    id: string,
    trafficVolume: number,
  ): Promise<void> {
    const url = `${this.gisServerUrl}/traffics/${id}`;
    await firstValueFrom(this.httpService.patch(url, { trafficVolume }));
  }
}
