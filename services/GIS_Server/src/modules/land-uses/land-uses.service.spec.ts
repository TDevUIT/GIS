import { Test, TestingModule } from '@nestjs/testing';
import { LandUsesService } from './land-uses.service';

describe('LandUsesService', () => {
  let service: LandUsesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LandUsesService],
    }).compile();

    service = module.get<LandUsesService>(LandUsesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
