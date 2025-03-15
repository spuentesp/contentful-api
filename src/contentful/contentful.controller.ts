import { Controller, Post, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ContentfulCronService } from '../contentful-cron/contentful-cron.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('contentful')
@ApiBearerAuth()
@Controller('contentful')
export class ContentfulController {
  constructor(private readonly contentfulCronService: ContentfulCronService) {}

  @UseGuards(JwtAuthGuard) 
  @Post('sync')
  @HttpCode(HttpStatus.OK) 
  @ApiOperation({ summary: 'Trigger Contentful synchronization' })
  @ApiResponse({ status: 200, description: 'Contentful sync triggered successfully' })
  async triggerContentfulSync() {
    await this.contentfulCronService.handleCron();
    return { message: 'Contentful sync triggered' }; 
  }
}