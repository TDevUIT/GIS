import { Test, TestingModule } from '@nestjs/testing';
import { TrafficsController } from './traffics.controller';
import { TrafficsService } from './traffics.service';

describe('TrafficsController', () => {
  let controller: TrafficsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrafficsController],
      providers: [TrafficsService],
    }).compile();

    controller = module.get<TrafficsController>(TrafficsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
