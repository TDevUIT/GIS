import { Test, TestingModule } from '@nestjs/testing';
import { InfrastructuresController } from './infrastructures.controller';
import { InfrastructuresService } from './infrastructures.service';

describe('InfrastructuresController', () => {
  let controller: InfrastructuresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InfrastructuresController],
      providers: [InfrastructuresService],
    }).compile();

    controller = module.get<InfrastructuresController>(InfrastructuresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
