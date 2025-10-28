import { Test, TestingModule } from '@nestjs/testing';
import { AccidentProcessingService } from './accident-processing.service';

describe('AccidentProcessingService', () => {
  let service: AccidentProcessingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccidentProcessingService],
    }).compile();

    service = module.get<AccidentProcessingService>(AccidentProcessingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
