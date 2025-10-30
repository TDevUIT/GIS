/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as cheerio from 'cheerio';
import { RabbitmqService } from '../../common/rabbitmq/rabbitmq.service';
import Redis from 'ioredis';
import {
  VertexAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google-cloud/vertexai';
import * as path from 'path';

@Injectable()
@Processor('scraper-queue')
export class AccidentsProcessor extends WorkerHost {
  private readonly logger = new Logger(AccidentsProcessor.name);
  private readonly redisClient: Redis;
  private readonly PROCESSED_URLS_KEY = 'processed_accident_urls';
  private readonly vertexAI: VertexAI;
  private readonly modelName: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly rabbitmqService: RabbitmqService,
  ) {
    super();

    const projectId = this.configService.get<string>('GOOGLE_PROJECT_ID');
    const location = this.configService.get<string>('GOOGLE_LOCATION');

    if (!projectId || !location) {
      throw new Error(
        'GOOGLE_PROJECT_ID and GOOGLE_LOCATION must be configured in .env file',
      );
    }

    const keyFilename = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'gcp-credentials.json',
    );

    if (keyFilename) {
      process.env.GOOGLE_APPLICATION_CREDENTIALS = keyFilename;
    }

    this.vertexAI = new VertexAI({
      project: projectId,
      location: location,
    });

    this.modelName = 'gemini-1.5-flash-latest';
    this.logger.log(`Using Vertex AI Model: ${this.modelName}`);

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
      const allArticleUrls = await this._fetchArticleUrls(targetUrl);

      const urlsToProcess: string[] = [];
      for (const url of allArticleUrls) {
        const isProcessed = await this.redisClient.sismember(
          this.PROCESSED_URLS_KEY,
          url,
        );
        if (!isProcessed) {
          urlsToProcess.push(url);
        }
      }

      if (urlsToProcess.length === 0) {
        this.logger.log(
          '--- [handleScrapeVnExpress] Finished Job. No new articles to scrape. ---',
        );
        return;
      }

      this.logger.log(`Found ${urlsToProcess.length} new articles to process.`);

      const CONCURRENCY_LIMIT = 5;
      let newArticlesScraped = 0;

      for (let i = 0; i < urlsToProcess.length; i += CONCURRENCY_LIMIT) {
        const batch = urlsToProcess.slice(i, i + CONCURRENCY_LIMIT);
        this.logger.log(
          `Processing batch ${Math.floor(i / CONCURRENCY_LIMIT) + 1} with ${batch.length} articles...`,
        );

        const results = await Promise.all(
          batch.map((url) => this.processArticle(url)),
        );

        newArticlesScraped += results.filter((success) => success).length;
      }

      this.logger.log(
        `--- [handleScrapeVnExpress] Finished Job. Scraped ${newArticlesScraped} new articles. ---`,
      );
    } catch (error) {
      this.logger.error(
        '[handleScrapeVnExpress] Failed to run job',
        (error as Error).stack,
      );
      throw error;
    }
  }

  private async processArticle(url: string): Promise<boolean> {
    try {
      const content = await this._scrapeArticleContent(url);
      if (!content || content.length < 200) {
        await this.redisClient.sadd(this.PROCESSED_URLS_KEY, url);
        return false;
      }

      const extractedData = await this._extractDataWithGemini(content);
      if (!extractedData) {
        this.logger.log(`No accident data found in: ${url}`);
        await this.redisClient.sadd(this.PROCESSED_URLS_KEY, url);
        return false;
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

      await this.redisClient.sadd(this.PROCESSED_URLS_KEY, url);
      this.logger.log(`Successfully processed and published data for: ${url}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to process article ${url}`,
        (error as Error).stack,
      );
      await this.redisClient.sadd(this.PROCESSED_URLS_KEY, url);
      return false;
    }
  }

  private async _fetchArticleUrls(url: string): Promise<string[]> {
    const { data } = await firstValueFrom(this.httpService.get(url));
    const $ = cheerio.load(String(data));
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
      const $ = cheerio.load(String(data));
      $('article.fck_detail').find('script, style, figure, table').remove();
      return $('article.fck_detail').text().replace(/\s\s+/g, ' ').trim();
    } catch (error) {
      this.logger.error(
        `Failed to scrape content from ${url}`,
        (error as Error).message,
      );
      return null;
    }
  }

  private async _extractDataWithGemini(content: string): Promise<any | null> {
    try {
      const generativeModel = this.vertexAI.getGenerativeModel({
        model: this.modelName,
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
        generationConfig: {
          maxOutputTokens: 8192,
          temperature: 0.2,
        },
      });

      const prompt = `Bạn là một trợ lý ảo chuyên trích xuất thông tin tai nạn giao thông từ văn bản tiếng Việt.
Phân tích văn bản sau và trả về một đối tượng JSON DUY NHẤT.
Các trường cần có:
- "location": string (Địa điểm cụ thể: đường, quận/huyện, tỉnh/thành phố).
- "dateTime": string (Thời gian xảy ra, định dạng ISO 8601 "YYYY-MM-DDTHH:mm:ssZ". Nếu chỉ có ngày, giờ mặc định là "T00:00:00Z").
- "description": string (Mô tả ngắn gọn vụ việc).
- "casualties": object (bao gồm "fatalities": số người chết, và "injuries": số người bị thương. Điền 0 nếu không có thông tin).
- "vehiclesInvolved": array of strings (ví dụ: ["xe tải", "xe máy"]).

Nếu văn bản KHÔNG MÔ TẢ về một vụ tai nạn giao thông, hãy trả về chuỗi "null".
Chỉ trả về JSON hoặc "null", không thêm bất kỳ giải thích hay ký tự markdown nào khác.

Văn bản: "${content.substring(0, 15000)}"`;

      const result = await generativeModel.generateContent(prompt);
      const response = result.response;

      if (!response.candidates || response.candidates.length === 0) {
        this.logger.warn('Vertex AI response has no candidates.');
        return null;
      }

      const responseText = response.candidates[0].content.parts[0].text?.trim();

      if (!responseText) {
        this.logger.warn('Vertex AI response text is empty.');
        return null;
      }

      if (responseText.toLowerCase() === 'null') return null;

      const cleanJsonString = responseText.replace(/^```json\s*|```\s*$/g, '');
      return JSON.parse(cleanJsonString);
    } catch (error) {
      this.logger.error('Error calling Vertex AI API or parsing JSON', error);
      throw error;
    }
  }
}
