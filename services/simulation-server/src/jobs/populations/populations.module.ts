import { Module } from '@nestjs/common';
import { PopulationsJobService } from './populations.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [PopulationsJobService],
})
export class PopulationsModule {}
