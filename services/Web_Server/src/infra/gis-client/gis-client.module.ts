import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { GisClientService } from './gis-client.service';

@Global()
@Module({
  imports: [HttpModule, ConfigModule],
  providers: [GisClientService],
  exports: [GisClientService],
})
export class GisClientModule {}
