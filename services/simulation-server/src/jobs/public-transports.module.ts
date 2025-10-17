import { Module } from '@nestjs/common';
import { PublicTransportsJobService } from './public-transports.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [PublicTransportsJobService],
})
export class PublicTransportsModule {}
