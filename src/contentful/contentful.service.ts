import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'contentful';

@Injectable()
export class ContentfulService {
  private client;

  constructor(private readonly configService: ConfigService) {
    this.client = createClient({
        space: this.configService.get<string>('CONTENTFUL_SPACE_ID', ''),
        accessToken: this.configService.get<string>('CONTENTFUL_ACCESS_TOKEN', ''),
      });
  }

  async fetchContentfulData(): Promise<any[]> {
    const response = await this.client.getEntries();
    return response.items;
  }
}
