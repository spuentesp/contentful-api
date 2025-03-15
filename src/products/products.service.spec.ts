import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: Repository<Product>;

  const mockProductRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
      getCount: jest.fn().mockResolvedValue(0),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Product), useValue: mockProductRepository },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new product', async () => {
      const dto: CreateProductDto = { name: 'Product A', price: 100, category: 'Category A', sku: 'SKU123' };
      const createdProduct = { id: 1, ...dto };

      mockProductRepository.create.mockReturnValue(createdProduct);
      mockProductRepository.save.mockResolvedValue(createdProduct);

      const result = await service.create(dto);

      expect(mockProductRepository.create).toHaveBeenCalledWith(dto);
      expect(mockProductRepository.save).toHaveBeenCalledWith(createdProduct);
      expect(result).toEqual(createdProduct);
    });
  });

  describe('findAll', () => {
    it('should return paginated list of products', async () => {
      const page = 1;
      const filter = { name: 'Test' };
      const products = [{ id: 1, name: 'Test Product', price: 50, category: 'Category A' }];
      
      mockProductRepository.createQueryBuilder().getMany.mockResolvedValue(products);
      mockProductRepository.createQueryBuilder().getCount.mockResolvedValue(products.length);

      const result = await service.findAll(page, filter);

      expect(result.data).toEqual(products);
      expect(result.total).toBe(products.length);
    });
  });

  describe('findOne', () => {
    it('should return a product if found', async () => {
      const product = { id: 1, name: 'Product A', price: 100, category: 'Category A' };
      mockProductRepository.findOne.mockResolvedValue(product);

      const result = await service.findOne(1);

      expect(mockProductRepository.findOne).toHaveBeenCalledWith({ where: { id: 1, deleted: false } });
      expect(result).toEqual(product);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the updated product', async () => {
      const updateDto: UpdateProductDto = { name: 'Updated Product' };
      const updatedProduct = { id: 1, ...updateDto };

      mockProductRepository.update.mockResolvedValue(undefined);
      mockProductRepository.findOne.mockResolvedValue(updatedProduct);

      const result = await service.update(1, updateDto);

      expect(mockProductRepository.update).toHaveBeenCalledWith(1, updateDto);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(updatedProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);

      await expect(service.update(99, { name: 'New Name' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete a product', async () => {
      const product = { id: 1, name: 'Product A', price: 100, deleted: false };
      const deletedProduct = { ...product, deleted: true };

      mockProductRepository.findOne.mockResolvedValue(product);
      mockProductRepository.save.mockResolvedValue(deletedProduct);

      await service.remove(1);

      expect(mockProductRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockProductRepository.save).toHaveBeenCalledWith(deletedProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
