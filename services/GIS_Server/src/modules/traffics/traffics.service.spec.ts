import { Test, TestingModule } from '@nestjs/testing';
import { TrafficsService } from './traffics.service';

describe('TrafficsService', () => {
  let service: TrafficsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrafficsService],
    }).compile();

    service = module.get<TrafficsService>(TrafficsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
