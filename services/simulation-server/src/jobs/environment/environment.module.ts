import { Module } from '@nestjs/common';
import { EnvironmentJobService } from './environment.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [EnvironmentJobService],
})
export class EnvironmentModule {}
