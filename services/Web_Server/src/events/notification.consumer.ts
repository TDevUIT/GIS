/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger, Inject } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { EventsGateway } from './events.gateway';

@Injectable()
export class NotificationConsumer {
  private readonly logger = new Logger(NotificationConsumer.name);

  constructor(
    private readonly eventsGateway: EventsGateway,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @RabbitSubscribe({
    exchange: 'ui_notifications',
    routingKey: '',
    queue: '',
    queueOptions: {
      exclusive: true,
      autoDelete: true,
      durable: false,
    },
  })
  public async handleUiNotification(msg: any) {
    const { event } = msg;
    this.logger.log(`🔔 [RabbitMQ] Received: ${event}`);

    if (this.isDataChangeEvent(event)) {
      await this.clearAnalyticsCache();
    }

    this.eventsGateway.notifyClients('server_push', msg);
  }

  private isDataChangeEvent(event: string): boolean {
    return (
      event.includes('.created') ||
      event.includes('.updated') ||
      event.includes('.deleted') ||
      event.includes('.bulk_updated')
    );
  }

  private async clearAnalyticsCache() {
    try {
      await (this.cacheManager as any).store?.reset?.();
      this.logger.log('🧹 [Cache] All cache cleared due to data update.');
    } catch (error) {
      this.logger.error('❌ Failed to clear cache:', error as Error);
    }
  }
}
