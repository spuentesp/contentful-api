import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getDeletedPercentage() {
    const totalProducts = await this.productRepository.count();
    const deletedProducts = await this.productRepository.count({ where: { deleted: true } });

    const percentage = totalProducts === 0 ? 0 : (deletedProducts / totalProducts) * 100;
    return { totalProducts, deletedProducts, deletedPercentage: percentage.toFixed(2) };
  }

  async getActivePercentage(withPrice?: boolean, startDate?: string, endDate?: string) {
    const where: any = { isDeleted: false };

    if (withPrice !== undefined) {
      where.price = withPrice ? { $gt: 0 } : 0;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.$gte = new Date(startDate);
      if (endDate) where.createdAt.$lte = new Date(endDate);
    }

    const totalProducts = await this.productRepository.count({ where: { deleted: false } });
    const filteredProducts = await this.productRepository.count({ where });

    const percentage = totalProducts === 0 ? 0 : (filteredProducts / totalProducts) * 100;
    return { totalProducts, filteredProducts, activePercentage: percentage.toFixed(2) };
  }

  async getCustomReport() {
    const categories = await this.productRepository
      .createQueryBuilder('product')
      .select('product.category, COUNT(*) as count')
      .where('product.isDeleted = false')
      .groupBy('product.category')
      .getRawMany();

    return { categoryDistribution: categories };
  }
}
