/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as cheerio from 'cheerio';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { RabbitmqService } from '../../common/rabbitmq/rabbitmq.service';
import Redis from 'ioredis';

@Injectable()
@Processor('scraper-queue')
export class AccidentsProcessor extends WorkerHost {
  private readonly logger = new Logger(AccidentsProcessor.name);
  private readonly genAI: GoogleGenerativeAI;
  private readonly redisClient: Redis;
  private readonly PROCESSED_URLS_KEY = 'processed_accident_urls';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly rabbitmqService: RabbitmqService,
  ) {
    super();
    const geminiApiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!geminiApiKey) throw new Error('GEMINI_API_KEY is not configured');
    this.genAI = new GoogleGenerativeAI(geminiApiKey);

    this.redisClient = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
    });
  }

  async process(job: Job<unknown, any, string>): Promise<any> {
    this.logger.log(`--- [${job.name}] Starting Job ---`);
    switch (job.name) {
      case 'scrape-vnexpress-accidents':
        return this.handleScrapeVnExpress();
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  }

  private async handleScrapeVnExpress() {
    const targetUrl = 'https://vnexpress.net/thoi-su/giao-thong';
    try {
      const articleUrls = await this._fetchArticleUrls(targetUrl);
      let newArticlesScraped = 0;

      for (const url of articleUrls) {
        const isProcessed = await this.redisClient.sismember(
          this.PROCESSED_URLS_KEY,
          url,
        );
        if (isProcessed) {
          continue;
        }

        const content = await this._scrapeArticleContent(url);
        if (!content || content.length < 200) {
          await this.redisClient.sadd(this.PROCESSED_URLS_KEY, url);
          continue;
        }

        const extractedData = await this._extractDataWithGemini(content);
        if (!extractedData) {
          this.logger.log(`No accident data found in: ${url}`);
          await this.redisClient.sadd(this.PROCESSED_URLS_KEY, url);
          continue;
        }

        const rawData = {
          ...extractedData,
          sourceUrl: url,
          scrapedAt: new Date().toISOString(),
        };

        await this.rabbitmqService.publish(
          'amq.topic',
          'accident.raw_data',
          rawData,
        );
        newArticlesScraped++;

        await this.redisClient.sadd(this.PROCESSED_URLS_KEY, url);
      }
      this.logger.log(
        `--- [handleScrapeVnExpress] Finished Job. Scraped ${newArticlesScraped} new articles. ---`,
      );
    } catch (error) {
      this.logger.error(
        `[handleScrapeVnExpress] Failed to run job`,
        error.stack,
      );
      throw error;
    }
  }

  private async _fetchArticleUrls(url: string): Promise<string[]> {
    const { data } = await firstValueFrom(this.httpService.get(url));
    const $ = cheerio.load(data);
    const urls = new Set<string>();
    $('article.item-news a[href$=".html"]').each((_, element) => {
      const href = $(element).attr('href');
      if (href && href.startsWith('https://vnexpress.net/')) {
        urls.add(href);
      }
    });
    return Array.from(urls);
  }

  private async _scrapeArticleContent(url: string): Promise<string | null> {
    try {
      const { data } = await firstValueFrom(this.httpService.get(url));
      const $ = cheerio.load(data);
      $('article.fck_detail').find('script, style, figure, table').remove();
      return $('article.fck_detail').text().replace(/\s\s+/g, ' ').trim();
    } catch (error) {
      this.logger.error(`Failed to scrape content from ${url}`, error.message);
      return null;
    }
  }

  private async _extractDataWithGemini(content: string): Promise<any | null> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-pro',
      });
      const prompt = `
                Bạn là một trợ lý ảo chuyên trích xuất thông tin tai nạn giao thông từ văn bản.
                Phân tích văn bản sau và trả về một đối tượng JSON DUY NHẤT.
                Các trường cần có:
                - "location": string (Địa điểm cụ thể: đường, quận/huyện, tỉnh/thành phố).
                - "dateTime": string (Thời gian xảy ra, định dạng ISO 8601 "YYYY-MM-DDTHH:mm:ssZ". Nếu chỉ có ngày, giờ là "T00:00:00Z").
                - "description": string (Mô tả ngắn gọn vụ việc).
                - "casualties": object (bao gồm "fatalities": số người chết, và "injuries": số người bị thương. Điền 0 nếu không có thông tin).
                - "vehiclesInvolved": array of strings (ví dụ: ["xe tải", "xe máy"]).
                
                Nếu văn bản KHÔNG MÔ TẢ về một vụ tai nạn giao thông, hãy trả về chuỗi "null".
                Chỉ trả về JSON hoặc "null", không thêm bất kỳ giải thích nào.
                
                Văn bản: "${content.substring(0, 8000)}"`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();

      if (responseText.toLowerCase() === 'null') return null;

      const cleanJsonString = responseText.replace(/^```json\s*|```\s*$/g, '');
      return JSON.parse(cleanJsonString);
    } catch (error) {
      this.logger.error('Error calling Gemini API or parsing JSON', error);
      return null;
    }
  }
}
