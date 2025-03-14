import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ContentfulService } from '../contentful/contentful.service';

@Injectable()
export class ContentfulCronService {
  private readonly logger = new Logger(ContentfulCronService.name);

  constructor(private readonly contentfulService: ContentfulService) {}

  @Cron(CronExpression.EVERY_HOUR)  
  async handleCron() {
    this.logger.log('Fetching Contentful API data...');

    try {
      const data = await this.contentfulService.fetchContentfulData();
      this.logger.log(`Successfully fetched ${data.length} items from Contentful.`);
    } catch (error) {
      this.logger.error('Failed to fetch data from Contentful:', error);
    }
  }
}
