import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = this.productRepository.create(createProductDto);
    return this.productRepository.save(newProduct);
  }

  async findAll(page: number, filter: any): Promise<{ data: Product[]; total: number }> {
    const limit = 5;
    const query = this.productRepository.createQueryBuilder('product')
      .where('product.deleted = :deleted', { deleted: false });

    if (filter.name) {
      query.andWhere('LOWER(product.name) LIKE LOWER(:name)', { name: `%${filter.name}%` });
    }
    if (filter.category) {
      query.andWhere('product.category = :category', { category: filter.category });
    }
    if (filter.minPrice) {
      query.andWhere('product.price >= :minPrice', { minPrice: filter.minPrice });
    }
    if (filter.maxPrice) {
      query.andWhere('product.price <= :maxPrice', { maxPrice: filter.maxPrice });
    }

    const total = await query.getCount();
    const data = await query
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { data, total };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id, deleted: false } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.productRepository.update(id, updateProductDto);
    const updatedProduct = await this.productRepository.findOne({ where: { id } });
    if (!updatedProduct) throw new NotFoundException('Product not found');
    return updatedProduct;
  }

  async remove(id: number): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    product.deleted = true;
    await this.productRepository.save(product);
  }
}
