/* eslint-disable @typescript-eslint/require-await */

import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, ChannelModel, Channel } from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private connection: ChannelModel;
  private channel: Channel;
  private readonly logger = new Logger(RabbitmqService.name);

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
    this.logger.log('RabbitMQ connection closed.');
  }

  private async connect() {
    const url = this.configService.get<string>('RABBITMQ_URL');
    if (!url) {
      throw new Error('RABBITMQ_URL is not defined in the configuration.');
    }
    try {
      this.connection = await connect(url);
      this.channel = await this.connection.createChannel();
      this.logger.log('Successfully connected to RabbitMQ.');
      await this.channel.assertExchange('amq.topic', 'topic', {
        durable: true,
      });
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ', error);
      throw error;
    }
  }

  async publish(
    exchange: string,
    routingKey: string,
    message: any,
  ): Promise<void> {
    if (!this.channel) {
      this.logger.error('RabbitMQ channel is not available.');
      throw new Error('Channel not initialized.');
    }
    const messageBuffer = Buffer.from(JSON.stringify(message));
    this.channel.publish(exchange, routingKey, messageBuffer);
    this.logger.log(
      `Message published to exchange '${exchange}' with key '${routingKey}'`,
    );
  }
}
