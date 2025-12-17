import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AccidentProcessingService } from './accident-processing.service';

@Module({
  imports: [HttpModule],
  providers: [AccidentProcessingService],
})
export class AccidentProcessingModule {}
