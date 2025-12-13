import { Test, TestingModule } from '@nestjs/testing';
import { PopulationsController } from './populations.controller';
import { PopulationsService } from './populations.service';

describe('PopulationsController', () => {
  let controller: PopulationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PopulationsController],
      providers: [PopulationsService],
    }).compile();

    controller = module.get<PopulationsController>(PopulationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
