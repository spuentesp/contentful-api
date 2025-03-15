import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';

describe('ReportsService', () => {
  let service: ReportsService;
  let productRepository: Repository<Product>;

  const mockProductRepository = {
    count: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: getRepositoryToken(Product), useValue: mockProductRepository },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));

    jest.clearAllMocks(); 
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDeletedPercentage', () => {
    it('should return correct percentage of deleted products', async () => {
      mockProductRepository.count.mockResolvedValueOnce(100); 
      mockProductRepository.count.mockResolvedValueOnce(20); 

      const result = await service.getDeletedPercentage();

      expect(mockProductRepository.count).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        totalProducts: 100,
        deletedProducts: 20,
        deletedPercentage: '20.00',
      });
    });

    it('should return 0% if there are no products', async () => {
      mockProductRepository.count.mockResolvedValueOnce(0);
      mockProductRepository.count.mockResolvedValueOnce(0);

      const result = await service.getDeletedPercentage();

      expect(mockProductRepository.count).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        totalProducts: 0,
        deletedProducts: 0,
        deletedPercentage: '0.00',
      });
    });
  });

  describe('getActivePercentage', () => {
    it('should return correct active percentage', async () => {
      mockProductRepository.count.mockResolvedValueOnce(80); 
      mockProductRepository.count.mockResolvedValueOnce(50);

      const result = await service.getActivePercentage(true, '2024-01-01', '2024-12-31');

      expect(mockProductRepository.count).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        totalProducts: 80,
        filteredProducts: 50,
        activePercentage: '62.50',
      });
    });

    it('should return 0% if there are no active products', async () => {
      mockProductRepository.count.mockResolvedValueOnce(0);
      mockProductRepository.count.mockResolvedValueOnce(0);

      const result = await service.getActivePercentage(true, '2024-01-01', '2024-12-31');

      expect(mockProductRepository.count).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        totalProducts: 0,
        filteredProducts: 0,
        activePercentage: '0.00',
      });
    });
  });

  describe('getCustomReport', () => {
    it('should return category distribution', async () => {
      const mockCategories = [
        { category: 'Electronics', count: 30 },
        { category: 'Clothing', count: 20 },
      ];
      mockProductRepository.createQueryBuilder().getRawMany.mockResolvedValue(mockCategories);

      const result = await service.getCustomReport();

      expect(mockProductRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual({ categoryDistribution: mockCategories });
    });

    it('should return empty distribution if no products exist', async () => {
      mockProductRepository.createQueryBuilder().getRawMany.mockResolvedValue([]);

      const result = await service.getCustomReport();

      expect(mockProductRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual({ categoryDistribution: [] });
    });
  });
});
