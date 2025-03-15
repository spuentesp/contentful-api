import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) 
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('deleted-percentage')
  @ApiOperation({ summary: 'Get percentage of deleted items' })
  @ApiResponse({ status: 200, description: 'Successful response' })
  getDeletedPercentage() {
    return this.reportsService.getDeletedPercentage();
  }

  @Get('active-percentage')
  @ApiOperation({ summary: 'Get percentage of active items' })
  @ApiResponse({ status: 200, description: 'Successful response' })
  @ApiQuery({ name: 'withPrice', required: false, type: Boolean })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  getActivePercentage(
    @Query('withPrice') withPrice?: boolean,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getActivePercentage(withPrice, startDate, endDate);
  }

  @Get('custom')
  @ApiOperation({ summary: 'Get custom report' })
  @ApiResponse({ status: 200, description: 'Successful response' })
  getCustomReport() {
    return this.reportsService.getCustomReport();
  }
}