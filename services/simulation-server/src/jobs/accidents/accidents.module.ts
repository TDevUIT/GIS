import { Module } from '@nestjs/common';
import { AccidentsJobService } from './accidents.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [AccidentsJobService],
})
export class AccidentsModule {}
