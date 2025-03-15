import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('ReportsController', () => {
  let controller: ReportsController;
  let reportsService: ReportsService;

  const mockReportsService = {
    getDeletedPercentage: jest.fn(),
    getActivePercentage: jest.fn(),
    getCustomReport: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [{ provide: ReportsService, useValue: mockReportsService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<ReportsController>(ReportsController);
    reportsService = module.get<ReportsService>(ReportsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDeletedPercentage', () => {
    it('should return deleted percentage from the service', async () => {
      const mockResponse = { totalProducts: 100, deletedProducts: 20, deletedPercentage: '20.00' };
      mockReportsService.getDeletedPercentage.mockResolvedValue(mockResponse);

      const result = await controller.getDeletedPercentage();

      expect(mockReportsService.getDeletedPercentage).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getActivePercentage', () => {
    it('should return active percentage with filters from the service', async () => {
      const mockResponse = { totalProducts: 80, filteredProducts: 50, activePercentage: '62.50' };
      mockReportsService.getActivePercentage.mockResolvedValue(mockResponse);

      const result = await controller.getActivePercentage(true, '2024-01-01', '2024-12-31');

      expect(mockReportsService.getActivePercentage).toHaveBeenCalledWith(true, '2024-01-01', '2024-12-31');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getCustomReport', () => {
    it('should return a custom report from the service', async () => {
      const mockResponse = {
        categoryDistribution: [
          { category: 'Electronics', count: 30 },
          { category: 'Clothing', count: 20 },
        ],
      };
      mockReportsService.getCustomReport.mockResolvedValue(mockResponse);

      const result = await controller.getCustomReport();

      expect(mockReportsService.getCustomReport).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });
});
