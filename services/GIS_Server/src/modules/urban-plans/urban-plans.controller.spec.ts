import { Test, TestingModule } from '@nestjs/testing';
import { UrbanPlansController } from './urban-plans.controller';
import { UrbanPlansService } from './urban-plans.service';

describe('UrbanPlansController', () => {
  let controller: UrbanPlansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrbanPlansController],
      providers: [UrbanPlansService],
    }).compile();

    controller = module.get<UrbanPlansController>(UrbanPlansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
