/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { parse } from 'wkt';

interface District {
  id: string;
  name: string;
  densityPerKm2: number | null;
  geom: string | null;
}

interface PublicTransport {
  id: string;
  routeName: string;
  districtId: string;
  frequencyMin: number | null;
  capacity: number | null;
  mode?: TransportMode;
}

enum TransportMode {
  BUS = 'BUS',
  METRO = 'METRO',
  BRT = 'BRT',
  WATERWAY = 'WATERWAY',
}

@Injectable()
export class PublicTransportsJobService {
  private readonly logger = new Logger(PublicTransportsJobService.name);
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

  @Cron(CronExpression.EVERY_5_MINUTES)
  async simulateNetworkExpansion() {
    this.logger.log('--- Starting Public Transport Network Expansion Job ---');
    try {
      const allDistricts = await this.fetchFromGis<District[]>('/districts');
      const allRoutes =
        await this.fetchFromGis<PublicTransport[]>('/public-transports');

      if (!allDistricts || allDistricts.length === 0) {
        this.logger.warn('No districts found. Skipping expansion job.');
        return;
      }

      const districtsWithMetro = new Set(
        allRoutes
          .filter((r) => r.mode === TransportMode.METRO)
          .map((r) => r.districtId),
      );

      const eligibleDistricts = allDistricts
        .filter((d) => !districtsWithMetro.has(d.id) && d.densityPerKm2)
        .sort((a, b) => (b.densityPerKm2 || 0) - (a.densityPerKm2 || 0));

      if (eligibleDistricts.length === 0) {
        this.logger.log(
          'All dense districts already have a Metro line. No expansion needed.',
        );
        return;
      }

      const targetDistrict = eligibleDistricts[0];
      this.logger.log(
        `Target district for expansion: "${targetDistrict.name}" (Density: ${targetDistrict.densityPerKm2})`,
      );

      const mode =
        (targetDistrict.densityPerKm2 || 0) > 15000 && Math.random() < 0.4
          ? TransportMode.METRO
          : TransportMode.BUS;

      const newRouteNumber = Math.floor(100 + Math.random() * 900);
      const newRoute = {
        districtId: targetDistrict.id,
        routeName: `Tuyến ${mode} #${newRouteNumber}: ${targetDistrict.name} - Trung tâm`,
        mode,
        capacity:
          mode === TransportMode.METRO
            ? 930
            : 60 + Math.floor(Math.random() * 20),
        stopsCount:
          mode === TransportMode.METRO
            ? 4 + Math.floor(Math.random() * 4)
            : 15 + Math.floor(Math.random() * 10),
        frequencyMin:
          mode === TransportMode.METRO
            ? 5 + Math.floor(Math.random() * 3)
            : 10 + Math.floor(Math.random() * 5),
        operatingHours: '05:00-22:00',
        geom: this.generateRandomLineStringInDistrict(targetDistrict.geom),
      };

      await this.postToGis('/public-transports', newRoute);
      this.logger.log(
        `Successfully simulated new ${mode} route: "${newRoute.routeName}"`,
      );
    } catch (error) {
      this.logger.error('Failed to run network expansion job', error.stack);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async optimizeRouteOperations() {
    this.logger.log('--- Starting Route Operations Optimization Job ---');
    try {
      const allRoutes =
        await this.fetchFromGis<PublicTransport[]>('/public-transports');
      if (!allRoutes || allRoutes.length === 0) return;

      const routesToOptimize = allRoutes
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);

      for (const route of routesToOptimize) {
        const optimizationChance = Math.random();
        const updatePayload: Partial<PublicTransport> = {};

        if (
          optimizationChance < 0.5 &&
          route.frequencyMin &&
          route.frequencyMin > 5
        ) {
          updatePayload.frequencyMin = route.frequencyMin - 1;
          this.logger.log(
            `Optimizing frequency for route "${route.routeName}" to ${updatePayload.frequencyMin} mins.`,
          );
        } else if (optimizationChance < 0.8 && route.capacity) {
          updatePayload.capacity = Math.floor(route.capacity * 1.1);
          this.logger.log(
            `Upgrading capacity for route "${route.routeName}" to ${updatePayload.capacity}.`,
          );
        } else {
          this.logger.debug(
            `No optimization for route "${route.routeName}" this time.`,
          );
          continue;
        }

        await this.patchToGis(`/public-transports/${route.id}`, updatePayload);
      }
      this.logger.log(
        `--- Finished Route Optimization Job. Processed ${routesToOptimize.length} routes. ---`,
      );
    } catch (error) {
      this.logger.error('Failed to run route optimization job', error.stack);
    }
  }

  private generateRandomLineStringInDistrict(
    districtGeomWkt: string | null,
  ): string {
    const defaultBounds = { minX: 106.6, maxX: 106.8, minY: 10.7, maxY: 10.9 };
    let bounds = defaultBounds;

    if (districtGeomWkt) {
      try {
        const geoJson = parse(districtGeomWkt);
        if (geoJson.type === 'Polygon') {
          const coords = geoJson.coordinates[0];
          const xs = coords.map((p) => p[0]);
          const ys = coords.map((p) => p[1]);
          bounds = {
            minX: Math.min(...xs),
            maxX: Math.max(...xs),
            minY: Math.min(...ys),
            maxY: Math.max(...ys),
          };
        }
      } catch {
        this.logger.warn('Could not parse district WKT, using default bounds.');
      }
    }

    const randomPoint = () => {
      const x = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
      const y = bounds.minY + Math.random() * (bounds.maxY - bounds.minY);
      return `${x.toFixed(6)} ${y.toFixed(6)}`;
    };

    return `LINESTRING(${randomPoint()}, ${randomPoint()})`;
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
