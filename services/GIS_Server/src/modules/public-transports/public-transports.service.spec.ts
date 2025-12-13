import { Test, TestingModule } from '@nestjs/testing';
import { PublicTransportsService } from './public-transports.service';

describe('PublicTransportsService', () => {
  let service: PublicTransportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicTransportsService],
    }).compile();

    service = module.get<PublicTransportsService>(PublicTransportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
