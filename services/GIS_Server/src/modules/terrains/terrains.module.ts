import { Module } from '@nestjs/common';
import { TerrainsService } from './terrains.service';
import { TerrainsController } from './terrains.controller';
import { PrismaModule } from '../../infra/prisma/prisma.module';
import { TerrainsRepository } from './terrains.repository';

@Module({
  imports: [PrismaModule],
  controllers: [TerrainsController],
  providers: [TerrainsService, TerrainsRepository],
  exports: [TerrainsService],
})
export class TerrainsModule {}
