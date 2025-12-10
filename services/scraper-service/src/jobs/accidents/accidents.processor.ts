/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';

@Injectable()
@Processor('scraper-queue')
export class AccidentsProcessor extends WorkerHost {
  private readonly logger = new Logger(AccidentsProcessor.name);
  private readonly redisClient: Redis;
  private readonly PROCESSED_URLS_KEY = 'processed_accident_urls_tesst';
  private readonly genAI: GoogleGenerativeAI;
  private readonly modelName: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly rabbitmqService: RabbitmqService,
  ) {
    super();

    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY must be configured in .env file');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);

    this.modelName = 'gemini-2.5-flash';
    this.logger.log(`✅ Using Gemini AI Model: ${this.modelName}`);
    this.logger.log(`API Key (first 10 chars): ${apiKey.substring(0, 10)}...`);

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
    const targetUrl = 'https://vnexpress.net/chu-de/tai-nan-giao-thong-2870';
    try {
      this.logger.log(`Fetching articles from: ${targetUrl}`);
      const allArticleUrls = await this._fetchArticleUrls(targetUrl);
      this.logger.log(`Found ${allArticleUrls.length} total articles on page`);

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
        this.logger.log(
          `Total processed URLs in cache: ${allArticleUrls.length}`,
        );
        return;
      }

      this.logger.log(
        `✅ Found ${urlsToProcess.length} NEW articles to process`,
      );
      this.logger.log(
        `Already processed: ${allArticleUrls.length - urlsToProcess.length} articles`,
      );

      const MAX_ARTICLES_PER_RUN = 1;
      const articlesToProcess = urlsToProcess.slice(0, MAX_ARTICLES_PER_RUN);

      this.logger.log(
        `📊 Crawl Config: ${MAX_ARTICLES_PER_RUN} article per run, runs every 2 minutes`,
      );

      if (articlesToProcess.length < urlsToProcess.length) {
        this.logger.log(
          `⚠️ Limited to ${MAX_ARTICLES_PER_RUN} article per run (${urlsToProcess.length - MAX_ARTICLES_PER_RUN} remaining for next runs)`,
        );
      }

      let newArticlesScraped = 0;
      const DELAY_BETWEEN_REQUESTS = 2000;

      for (let i = 0; i < articlesToProcess.length; i++) {
        const url = articlesToProcess[i];
        this.logger.log(
          `Processing article ${i + 1}/${articlesToProcess.length}...`,
        );

        const success = await this.processArticle(url);
        if (success) {
          newArticlesScraped++;
        }

        if (i < articlesToProcess.length - 1) {
          this.logger.log(
            `⏳ Waiting ${DELAY_BETWEEN_REQUESTS / 1000}s before next request...`,
          );
          await new Promise((resolve) =>
            setTimeout(resolve, DELAY_BETWEEN_REQUESTS),
          );
        }
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
      this.logger.log(`📄 Scraping: ${url}`);
      const scraped = await this._scrapeArticleContent(url);
      if (!scraped || !scraped.content || scraped.content.length < 200) {
        this.logger.log(
          `⚠️ Content too short (${scraped?.content?.length || 0} chars), skipping...`,
        );
        await this.redisClient.sadd(this.PROCESSED_URLS_KEY, url);
        return false;
      }
      this.logger.log(
        `✓ Content scraped: ${scraped.content.length} characters`,
      );
      if (scraped.publishTime) {
        this.logger.log(`📅 Publish time from HTML: ${scraped.publishTime}`);
      }

      this.logger.log(`🤖 Analyzing with Gemini AI (gemini-pro)...`);
      const extractedData = await this._extractDataWithGemini(
        scraped.content,
        scraped.publishTime,
      );
      if (!extractedData) {
        this.logger.log(`❌ No accident data found in: ${url}`);
        await this.redisClient.sadd(this.PROCESSED_URLS_KEY, url);
        return false;
      }
      this.logger.log(
        `✅ Extracted data:`,
        JSON.stringify(extractedData, null, 2),
      );

      let coordinates = extractedData.coordinates;
      if (!coordinates && extractedData.location) {
        this.logger.log(`🌍 Geocoding location: ${extractedData.location}`);
        coordinates = await this._geocodeLocation(extractedData.location);
        if (coordinates) {
          this.logger.log(
            `✅ Geocoded: lat=${coordinates.lat}, lng=${coordinates.lng}`,
          );
        } else {
          this.logger.warn(
            `⚠️ Geocoding failed for: ${extractedData.location}`,
          );
        }
      }

      const geom = coordinates
        ? `POINT(${coordinates.lng} ${coordinates.lat})`
        : null;

      const rawData = {
        ...extractedData,
        coordinates,
        geom,
        sourceUrl: url,
        scrapedAt: new Date().toISOString(),
      };

      this.logger.log(`📤 Publishing to RabbitMQ...`);
      this.logger.log(`Data to publish:`, JSON.stringify(rawData, null, 2));

      await this.rabbitmqService.publish(
        'amq.topic',
        'accident.raw_data',
        rawData,
      );

      await this.redisClient.sadd(this.PROCESSED_URLS_KEY, url);
      this.logger.log(`✅ SUCCESS: Published accident data`);
      this.logger.log(`   Location: ${extractedData.location}`);
      this.logger.log(
        `   Coordinates: ${coordinates ? `${coordinates.lat}, ${coordinates.lng}` : 'N/A'}`,
      );
      this.logger.log(
        `   Casualties: ${extractedData.casualties?.fatalities || 0} dead, ${extractedData.casualties?.injuries || 0} injured`,
      );
      this.logger.log(
        `   Vehicles: ${extractedData.vehiclesInvolved?.join(', ') || 'N/A'}`,
      );
      this.logger.log(
        `─────────────────────────────────────────────────────────`,
      );
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

  private async _scrapeArticleContent(
    url: string,
  ): Promise<{ content: string; publishTime?: string } | null> {
    try {
      const { data } = await firstValueFrom(this.httpService.get(url));
      const $ = cheerio.load(String(data));

      let publishTime: string | undefined;

      const metaTime = $('meta[property="article:published_time"]').attr(
        'content',
      );
      if (metaTime) {
        publishTime = metaTime;
      }

      if (!publishTime) {
        const dateText =
          $('.date').text().trim() ||
          $('.header-content .date').text().trim() ||
          $('span.date').text().trim();
        if (dateText) {
          publishTime = dateText;
          this.logger.log(`📅 Found date in HTML: ${dateText}`);
        }
      }

      $('article.fck_detail').find('script, style, figure, table').remove();
      const content = $('article.fck_detail')
        .text()
        .replace(/\s\s+/g, ' ')
        .trim();

      return { content, publishTime };
    } catch (error) {
      this.logger.error(
        `Failed to scrape content from ${url}`,
        (error as Error).message,
      );
      return null;
    }
  }

  private async _geocodeLocation(
    location: string,
  ): Promise<{ lat: number; lng: number } | null> {
    const attempts = this._generateGeocodingAttempts(location);

    for (let i = 0; i < attempts.length; i++) {
      const attempt = attempts[i];
      this.logger.log(
        `🔍 Geocoding attempt ${i + 1}/${attempts.length}: "${attempt}"`,
      );

      try {
        const encodedLocation = encodeURIComponent(attempt);
        const url = `https://nominatim.openstreetmap.org/search?q=${encodedLocation}&format=json&limit=1&countrycodes=vn`;

        const { data } = await firstValueFrom(
          this.httpService.get(url, {
            headers: {
              'User-Agent': 'IE402-GIS-Scraper/1.0',
            },
          }),
        );

        if (Array.isArray(data) && data.length > 0) {
          const result = data[0] as {
            lat: string;
            lon: string;
            display_name: string;
          };
          const coordinates = {
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
          };
          this.logger.log(`✅ Geocoding success: ${result.display_name}`);
          this.logger.log(
            `   Coordinates: lat=${coordinates.lat}, lng=${coordinates.lng}`,
          );
          return coordinates;
        } else {
          this.logger.log(`   ❌ No results for: "${attempt}"`);
        }

        if (i < attempts.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error) {
        this.logger.error(
          `   ⚠️ Request failed for: "${attempt}"`,
          (error as Error).message,
        );
      }
    }

    this.logger.warn(`❌ All geocoding attempts failed for: "${location}"`);
    return null;
  }

  private _generateGeocodingAttempts(location: string): string[] {
    const attempts: string[] = [location];

    const parts = location.split(',').map((p) => p.trim());

    if (parts.length >= 3) {
      const districtProvince = parts.slice(-2).join(', ');
      attempts.push(districtProvince);

      const province = parts[parts.length - 1].replace(
        /^(tỉnh|thành phố)\s+/i,
        '',
      );
      attempts.push(province + ', Vietnam');
    } else if (parts.length >= 2) {
      const province = parts[parts.length - 1].replace(
        /^(tỉnh|thành phố)\s+/i,
        '',
      );
      attempts.push(province + ', Vietnam');
    }

    return [...new Set(attempts)];
  }

  private async _extractDataWithGemini(
    content: string,
    publishTime?: string,
  ): Promise<any | null> {
    try {
      this.logger.log(
        `🔧 Creating Gemini model instance with: ${this.modelName}`,
      );
      const generativeModel = this.genAI.getGenerativeModel({
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

      const publishTimeHint = publishTime
        ? `
      [THÔNG TIN THÊM]
      Thời gian đăng bài: ${publishTime}
      Sử dụng thông tin này nếu văn bản không có thời gian xảy ra tai nạn rõ ràng.`
        : '';

      const prompt = `Bạn là một trợ lý ảo chuyên trích xuất thông tin tai nạn giao thông từ văn bản tiếng Việt.
      Phân tích văn bản sau và trả về một đối tượng JSON DUY NHẤT.

      Các trường cần có:
      - "location": string (Địa chỉ xảy ra tai nạn)

        QUY TẮC TRÍCH XUẤT ĐỊA CHỈ (QUAN TRỌNG):
        * Phải tìm TÊN ĐƯỜNG + QUẬN/HUYỆN + TỈNH/THÀNH PHỐ từ văn bản
        * Ưu tiên các từ khóa: "tại", "ở", "trên", "dọc", "thuộc", "khu vực"
        * Format: "Đường [tên đường], [Quận/Huyện], [Tỉnh/Thành phố]"

        KHÔNG ĐƯỢC:
        ❌ "lề đường" - quá chung chung
        ❌ "ngã tư" - thiếu tên đường
        ❌ "gần nhà hàng X" - không có địa chỉ hành chính

        PHẢI LÀM:
        ✅ Tìm tên đường cụ thể trong văn bản
        ✅ Tìm tên quận/huyện, xã/phường
        ✅ Tìm tên tỉnh/thành phố (thường ở đầu hoặc cuối bài)
        ✅ Ghép thành: "Đường ABC, Quận/Huyện XYZ, Tỉnh/TP DEF"

        VÍ DỤ:
        - Text: "hôm 25/10 tại Trần Hưng Đạo, Mỹ Tho. Đồng Tháp..."
          → location: "Trần Hưng Đạo, Mỹ Tho, Đồng Tháp"

        - Text: "Quốc lộ 5, xã Mao Điền, huyện Cẩm Giàng, tỉnh Hải Dương"
          → location: "Quốc lộ 5, xã Mao Điền, huyện Cẩm Giàng, Hải Dương"

        - Text: "ở ngã tư Nguyễn Văn Linh, Quận 7, TP.HCM"
          → location: "Nguyễn Văn Linh, Quận 7, TP.HCM"

      - "dateTime": string (Thời gian xảy ra tai nạn, định dạng ISO 8601 "YYYY-MM-DDTHH:mm:ssZ".
        * Nếu văn bản có ngày giờ cụ thể như "29/10/2025, 15:58", "sáng 29/10", "chiều 28/10" → convert sang ISO.
        * Nếu chỉ có "hôm qua", "sáng nay", "tối qua" → tính toán dựa vào thời gian đăng bài.
        * Nếu không có thông tin thời gian → dùng thời gian đăng bài.
        * Múi giờ: GMT+7 (Việt Nam)).

      - "description": string (Mô tả ngắn gọn vụ việc, 1-2 câu).

      - "casualties": object (bao gồm "fatalities": số người chết, và "injuries": số người bị thương. Điền 0 nếu không có thông tin).

      - "vehiclesInvolved": array of strings (ví dụ: ["xe tải", "xe máy"], ["ôtô", "xe con"]).

      - "coordinates": object hoặc null (nếu bài báo có đề cập tọa độ GPS, latitude, longitude thì extract ra dạng {"lat": number, "lng": number}. Nếu không có thì để null).

      LƯU Ý CUỐI:
      - Thời gian phải có năm: 2025, không được thiếu.
      - Nếu văn bản KHÔNG MÔ TẢ về một vụ tai nạn giao thông, hãy trả về chuỗi "null".
      - Chỉ trả về JSON hoặc "null", không thêm bất kỳ giải thích hay ký tự markdown nào khác.${publishTimeHint}

      Văn bản: "${content.substring(0, 15000)}"`;

      this.logger.log(
        `📤 Sending request to Gemini API with model: ${this.modelName}`,
      );
      const result = await generativeModel.generateContent(prompt);
      const response = result.response;

      this.logger.log(`📥 Received response from Gemini API`);
      this.logger.log(`Response object:`, JSON.stringify(response, null, 2));

      if (!response.candidates || response.candidates.length === 0) {
        this.logger.warn('⚠️ Gemini AI response has no candidates.');
        this.logger.log(`Full response:`, JSON.stringify(response, null, 2));
        return null;
      }

      const responseText = response.candidates[0].content.parts[0].text?.trim();
      this.logger.log(`📝 Raw response text: ${responseText}`);

      if (!responseText) {
        this.logger.warn('⚠️ Gemini AI response text is empty.');
        return null;
      }

      if (responseText.toLowerCase() === 'null') {
        this.logger.log('❌ Response is "null" - not an accident article');
        return null;
      }

      const cleanJsonString = responseText.replace(/^```json\s*|```\s*$/g, '');
      this.logger.log(`🧹 Cleaned JSON string: ${cleanJsonString}`);
      return JSON.parse(cleanJsonString);
    } catch (error) {
      this.logger.error('Error calling Gemini AI API or parsing JSON', error);
      throw error;
    }
  }
}
