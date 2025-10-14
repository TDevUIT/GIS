/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
interface PopulationSummaryRecord {
  id: string;
  year: number;
  populationTotal: number;
  householdsTotal: number;
}
interface DemographicDetail {
  ageMin: number;
  ageMax: number | null;
  male: number;
  female: number;
}
interface HouseholdDetail {
  householdSize: number;
  incomeLevel: string | null;
  housingType: string | null;
}
interface PopulationDetailRecord extends PopulationSummaryRecord {
  demographics: DemographicDetail[];
  households: HouseholdDetail[];
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

  @Cron(CronExpression.EVERY_MINUTE)
  async simulateYearlyPopulationGrowth() {
    this.logger.log('--- Starting Yearly Population Simulation Job ---');
    try {
      const districts = await this.fetchFromGis<District[]>('/districts');
      this.logger.log(`Found ${districts.length} districts to process.`);
      const currentYear = new Date().getFullYear();
      let simulatedCount = 0;

      for (const district of districts) {
        const populationHistory = await this.fetchFromGis<
          PopulationSummaryRecord[]
        >(`/populations?districtId=${district.id}`);

        if (populationHistory.length === 0) {
          this.logger.log(
            `District "${district.name}" has no population data. Bootstrapping initial data...`,
          );
          const newPopulationDto = this.createSeedPopulationData(
            district.id,
            currentYear,
          );
          await this.postToGis('/populations', newPopulationDto);
          this.logger.log(
            `Bootstrapped initial population for "${district.name}" in ${currentYear}: ${newPopulationDto.populationTotal}`,
          );
          simulatedCount++;
          continue;
        }

        const latestSummary = populationHistory[0];

        if (latestSummary.year >= currentYear) {
          this.logger.log(
            `Data for "${district.name}" in ${currentYear} already exists. Skipping.`,
          );
          continue;
        }

        const latestRecord = await this.fetchFromGis<PopulationDetailRecord>(
          `/populations/${latestSummary.id}`,
        );

        if (
          !latestRecord.demographics?.length ||
          !latestRecord.households?.length
        ) {
          this.logger.warn(
            `Latest record for "${district.name}" (year ${latestRecord.year}) is missing detailed data. Skipping simulation for this district.`,
          );
          continue;
        }

        const growthRate = 1 + (Math.random() * 0.02 + 0.015);
        const newPopulationTotal = Math.floor(
          latestRecord.populationTotal * growthRate,
        );
        const householdRatio =
          latestRecord.populationTotal / latestRecord.householdsTotal;
        const newHouseholdsTotal = Math.floor(
          newPopulationTotal / householdRatio,
        );

        const newDemographics = this.simulateDemographics(
          latestRecord.demographics,
          latestRecord.populationTotal,
          newPopulationTotal,
        );
        const newHouseholds = this.simulateHouseholds(
          latestRecord.households,
          newHouseholdsTotal,
        );

        const newPopulationDto = {
          year: currentYear,
          populationTotal: newPopulationTotal,
          householdsTotal: newHouseholdsTotal,
          districtId: district.id,
          demographics: newDemographics,
          households: newHouseholds,
        };

        await this.postToGis('/populations', newPopulationDto);
        this.logger.log(
          `Simulated FULL population data for "${district.name}" in ${currentYear}: ${newPopulationTotal} people.`,
        );
        simulatedCount++;
      }
      this.logger.log(
        `--- Finished Population Simulation Job. Processed data for ${simulatedCount} districts. ---`,
      );
    } catch (error) {
      this.logger.error(
        'Failed to run population simulation job',
        error.response?.data || error.message,
      );
    }
  }

  private createSeedPopulationData(districtId: string, year: number) {
    const populationTotal = 50000 + Math.floor(Math.random() * 20000);
    const householdsTotal = Math.floor(
      populationTotal / (3.2 + Math.random() * 0.6),
    );

    const demographics: {
      ageMin: number;
      ageMax: number | null;
      proportion: number;
    }[] = [
      { ageMin: 0, ageMax: 14, proportion: 0.22 },
      { ageMin: 15, ageMax: 24, proportion: 0.18 },
      { ageMin: 25, ageMax: 54, proportion: 0.45 },
      { ageMin: 55, ageMax: 64, proportion: 0.09 },
      { ageMin: 65, ageMax: null, proportion: 0.06 },
    ];

    const seedDemographics = this.simulateDemographics(
      demographics.map((d) => ({ ...d, male: 0, female: 0 })),
      1,
      populationTotal,
    );

    const seedHouseholds = this.generateSeedHouseholds(householdsTotal);

    return {
      year,
      populationTotal,
      householdsTotal,
      districtId,
      demographics: seedDemographics,
      households: seedHouseholds,
    };
  }

  private generateSeedHouseholds(totalHouseholds: number): HouseholdDetail[] {
    const sampleSize = Math.min(totalHouseholds, 10);
    this.logger.log(
      `Generating a sample of ${sampleSize} households for seeding...`,
    );

    const sizePool = [2, 2, 3, 3, 3, 4, 4, 1, 5];
    const incomePool = [
      'TrungBinh',
      'TrungBinh',
      'TrungBinh',
      'Thap',
      'Thap',
      'Cao',
    ];
    const housingPool = [
      'NhaTro',
      'NhaTrongHem',
      'NhaRieng',
      'NhaTro',
      'NhaTrongHem',
      'ChungCuCaoCap',
    ];

    const households: HouseholdDetail[] = [];
    for (let i = 0; i < sampleSize; i++) {
      households.push({
        householdSize: sizePool[Math.floor(Math.random() * sizePool.length)],
        incomeLevel: incomePool[Math.floor(Math.random() * incomePool.length)],
        housingType:
          housingPool[Math.floor(Math.random() * housingPool.length)],
      });
    }
    return households;
  }

  private simulateDemographics(
    oldDemographics: (DemographicDetail | any)[],
    oldTotal: number,
    newTotal: number,
  ): DemographicDetail[] {
    const newDemographics: DemographicDetail[] = [];
    let calculatedTotal = 0;
    const lastIndex = oldDemographics.length - 1;

    for (let i = 0; i < oldDemographics.length; i++) {
      const demo = oldDemographics[i];
      const groupTotal = demo.male + demo.female || 0;
      const groupProportion = demo.proportion || groupTotal / oldTotal;
      const newGroupTotal = Math.round(newTotal * groupProportion);

      if (groupTotal === 0 && !demo.proportion) {
        newDemographics.push({ ...demo, male: 0, female: 0 });
        continue;
      }

      const maleProportion = groupTotal > 0 ? demo.male / groupTotal : 0.5;
      let newMale = Math.round(newGroupTotal * maleProportion);
      let newFemale = newGroupTotal - newMale;

      calculatedTotal += newMale + newFemale;

      if (i === lastIndex) {
        const diff = newTotal - calculatedTotal;
        newFemale += diff;
        if (newFemale < 0) {
          newMale += newFemale;
          newFemale = 0;
        }
      }

      newDemographics.push({
        ageMin: demo.ageMin,
        ageMax: demo.ageMax,
        male: newMale,
        female: newFemale,
      });
    }
    return newDemographics;
  }

  private simulateHouseholds(
    oldHouseholds: HouseholdDetail[],
    newTotal: number,
  ): HouseholdDetail[] {
    if (oldHouseholds.length === 0) return [];
    const sizePool = oldHouseholds.map((h) => h.householdSize);
    const incomePool = oldHouseholds
      .map((h) => h.incomeLevel)
      .filter(Boolean) as string[];
    const housingPool = oldHouseholds
      .map((h) => h.housingType)
      .filter(Boolean) as string[];

    if (incomePool.length === 0 || housingPool.length === 0) return [];

    const newHouseholds: HouseholdDetail[] = [];
    for (let i = 0; i < newTotal; i++) {
      newHouseholds.push({
        householdSize: sizePool[Math.floor(Math.random() * sizePool.length)],
        incomeLevel: incomePool[Math.floor(Math.random() * incomePool.length)],
        housingType:
          housingPool[Math.floor(Math.random() * housingPool.length)],
      });
    }
    return newHouseholds;
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
