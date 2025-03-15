import { Controller, Post, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ContentfulCronService } from '../contentful-cron/contentful-cron.service';

@Controller('contentful')
export class ContentfulController {
  constructor(private readonly contentfulCronService: ContentfulCronService) {}

  @UseGuards(JwtAuthGuard) 
  @Post('sync')
  @HttpCode(HttpStatus.OK) 
  async triggerContentfulSync() {
    await this.contentfulCronService.handleCron();
    return { message: 'Contentful sync triggered' }; 
  }
}
