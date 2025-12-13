import { Module } from '@nestjs/common';
import { TerrainsService } from './terrains.service';
import { TerrainsController } from './terrains.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/infra/prisma/prisma.module';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [TerrainsController],
  providers: [TerrainsService],
})
export class TerrainsModule {}
