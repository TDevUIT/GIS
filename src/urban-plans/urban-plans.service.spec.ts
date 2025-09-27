import { Test, TestingModule } from '@nestjs/testing';
import { UrbanPlansService } from './urban-plans.service';

describe('UrbanPlansService', () => {
  let service: UrbanPlansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrbanPlansService],
    }).compile();

    service = module.get<UrbanPlansService>(UrbanPlansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
