import { Test, TestingModule } from '@nestjs/testing';
import { AirQualitiesController } from './air-qualities.controller';
import { AirQualitiesService } from './air-qualities.service';

describe('AirQualitiesController', () => {
  let controller: AirQualitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirQualitiesController],
      providers: [AirQualitiesService],
    }).compile();

    controller = module.get<AirQualitiesController>(AirQualitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
