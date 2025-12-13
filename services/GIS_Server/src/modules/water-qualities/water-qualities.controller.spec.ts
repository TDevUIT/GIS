import { Test, TestingModule } from '@nestjs/testing';
import { WaterQualitiesController } from './water-qualities.controller';
import { WaterQualitiesService } from './water-qualities.service';

describe('WaterQualitiesController', () => {
  let controller: WaterQualitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WaterQualitiesController],
      providers: [WaterQualitiesService],
    }).compile();

    controller = module.get<WaterQualitiesController>(WaterQualitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
