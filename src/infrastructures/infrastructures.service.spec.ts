import { Test, TestingModule } from '@nestjs/testing';
import { InfrastructuresService } from './infrastructures.service';

describe('InfrastructuresService', () => {
  let service: InfrastructuresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InfrastructuresService],
    }).compile();

    service = module.get<InfrastructuresService>(InfrastructuresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
