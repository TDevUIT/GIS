import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AccidentProcessingModule } from './modules/accident-processing/accident-processing.module';
import { Ie402MessagingModule } from '@ie402/messaging';

@Global()
@Module({
  imports: [Ie402MessagingModule],
  exports: [Ie402MessagingModule],
})
class GlobalRabbitMQModule {}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GlobalRabbitMQModule,
    HttpModule,
    AccidentProcessingModule,
  ],
})
export class AppModule {}
