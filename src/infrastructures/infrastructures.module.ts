import { Module } from '@nestjs/common';
import { InfrastructuresService } from './infrastructures.service';
import { InfrastructuresController } from './infrastructures.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InfrastructuresController],
  providers: [InfrastructuresService],
  exports: [InfrastructuresService],
})
export class InfrastructuresModule {}
