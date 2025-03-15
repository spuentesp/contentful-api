import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, ContentfulClientApi } from 'contentful';

@Injectable()
export class ContentfulService {
  private client: ContentfulClientApi<any>;

  constructor(private readonly configService: ConfigService) {
    this.client = createClient({
      space: this.configService.get<string>('CONTENTFUL_SPACE_ID',''),
      accessToken: this.configService.get<string>('CONTENTFUL_ACCESS_TOKEN',''),
      environment: this.configService.get<string>('CONTENTFUL_ENVIRONMENT', 'master'),
    });
  }

  async fetchContentfulData(): Promise<any[]> {
    try {
      const response = await this.client.getEntries({
        content_type: this.configService.get<string>('CONTENTFUL_CONTENT_TYPE',''),
      });
      return response.items;
    } catch (error) {
      console.error('[ContentfulService] Error fetching data:', error.message);
      return [];
    }
  }
}
