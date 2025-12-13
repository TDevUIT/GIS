import { Module } from '@nestjs/common';
import { TerrainsService } from './terrains.service';
import { TerrainsController } from './terrains.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TerrainsController],
  providers: [TerrainsService],
  exports: [TerrainsService],
})
export class TerrainsModule {}
