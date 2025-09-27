import { Test, TestingModule } from '@nestjs/testing';
import { AirQualitiesService } from './air-qualities.service';

describe('AirQualitiesService', () => {
  let service: AirQualitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AirQualitiesService],
    }).compile();

    service = module.get<AirQualitiesService>(AirQualitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
