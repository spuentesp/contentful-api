import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: '12345', description: 'The SKU of the product' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 'Product Name', description: 'The name of the product' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Brand Name', description: 'The brand of the product', required: false })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({ example: 'Model XYZ', description: 'The model of the product', required: false })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiProperty({ example: 'Category Name', description: 'The category of the product' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'Red', description: 'The color of the product', required: false })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ example: 99.99, description: 'The price of the product' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: 'USD', description: 'The currency of the product', required: false })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ example: 100, description: 'The stock quantity of the product', required: false })
  @IsNumber()
  @IsOptional()
  stock?: number;
}