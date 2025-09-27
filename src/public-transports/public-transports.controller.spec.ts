import { Test, TestingModule } from '@nestjs/testing';
import { PublicTransportsController } from './public-transports.controller';
import { PublicTransportsService } from './public-transports.service';

describe('PublicTransportsController', () => {
  let controller: PublicTransportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicTransportsController],
      providers: [PublicTransportsService],
    }).compile();

    controller = module.get<PublicTransportsController>(PublicTransportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
