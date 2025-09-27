import { Test, TestingModule } from '@nestjs/testing';
import { WaterQualitiesService } from './water-qualities.service';

describe('WaterQualitiesService', () => {
  let service: WaterQualitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WaterQualitiesService],
    }).compile();

    service = module.get<WaterQualitiesService>(WaterQualitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
