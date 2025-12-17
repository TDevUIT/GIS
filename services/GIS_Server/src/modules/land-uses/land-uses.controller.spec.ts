import { Test, TestingModule } from '@nestjs/testing';
import { LandUsesController } from './land-uses.controller';
import { LandUsesService } from './land-uses.service';

describe('LandUsesController', () => {
  let controller: LandUsesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LandUsesController],
      providers: [LandUsesService],
    }).compile();

    controller = module.get<LandUsesController>(LandUsesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
