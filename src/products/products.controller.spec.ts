import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ContentfulCronService } from '../contentful-cron/contentful-cron.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProduct = {
    id: 1,
    sku: 'TEST123',
    name: 'Test Product',
    brand: 'Test Brand',
    model: 'Test Model',
    category: 'Test Category',
    color: 'Black',
    price: 99.99,
    currency: 'USD',
    stock: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
    deleted: false,
  };

  const mockContentfulCronService = {
    handleCron: jest.fn(), 
  };

  const mockProductsService = {
    create: jest.fn().mockResolvedValue(mockProduct),
    findAll: jest.fn().mockResolvedValue({ data: [mockProduct], total: 1 }),
    findOne: jest.fn().mockResolvedValue(mockProduct),
    update: jest.fn().mockResolvedValue(mockProduct),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      
      providers: [{ provide: ProductsService, useValue: mockProductsService },
        { provide: ContentfulCronService, useValue: mockContentfulCronService }, ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should create a product', async () => {
      const dto: CreateProductDto = {
        sku: 'TEST123',
        name: 'Test Product',
        brand: 'Test Brand',
        model: 'Test Model',
        category: 'Test Category',
        color: 'Black',
        price: 99.99,
        currency: 'USD',
        stock: 10,
      };

      expect(await controller.create(dto)).toEqual(mockProduct);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll()', () => {
    it('should return paginated products', async () => {
      const result = await controller.findAll(1, 'Test Product', 'Test Category', 50, 150);
      expect(result).toEqual({ data: [mockProduct], total: 1 });
      expect(service.findAll).toHaveBeenCalledWith(1, {
        name: 'Test Product',
        category: 'Test Category',
        minPrice: 50,
        maxPrice: 150,
      });
    });
  });

  describe('findOne()', () => {
    it('should return a single product', async () => {
      expect(await controller.findOne(1)).toEqual(mockProduct);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update()', () => {
    it('should update a product', async () => {
      const dto: UpdateProductDto = { name: 'Updated Product' };
      expect(await controller.update(1, dto)).toEqual(mockProduct);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove()', () => {
    it('should remove a product', async () => {
      expect(await controller.remove(1)).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
