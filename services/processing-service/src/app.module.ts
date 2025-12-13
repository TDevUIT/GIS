import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { HttpModule } from '@nestjs/axios';
import { AccidentProcessingModule } from './modules/accident-processing/accident-processing.module';

@Global()
@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        exchanges: [
          {
            name: 'amq.topic',
            type: 'topic',
          },
        ],
        uri: configService.get<string>('RABBITMQ_URL'),
        connectionInitOptions: { wait: false },
      }),
    }),
  ],
  exports: [RabbitMQModule],
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
