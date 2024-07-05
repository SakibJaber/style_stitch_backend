import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/models/product.schema';
import { parse } from 'csv-parse';
import * as fs from 'fs';
import { Category } from 'src/models/category.schema';
import { CreateCategoryDto } from 'src/dto/create-category.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private productModel: Model<Product>,
    @InjectModel('Category') private categoryModel: Model<Category>,
    // private readonly authService: AuthService, // Inject AuthService
  ) {}

  async getAllProductsDetails() {
    const productData = await this.productModel.find();
    if (!productData || productData.length == 0) {
      throw new NotFoundException('Products data not found!');
    }
    return productData;
  }

  async parseCsv(filePath: string): Promise<void> {
    const products = [];
    const stream = fs.createReadStream(filePath).pipe(parse({ columns: true }));

    return new Promise((resolve, reject) => {
      stream
        .on('data', (data) => {
          products.push(data);
          console.log(products);
        })
        .on('end', async () => {
          try {
            // Insert products into the database
            await this.productModel.insertMany(products);
            resolve();
          } catch (error) {
            if (error.code === 11000) {
              reject(
                new HttpException(
                  'Duplicate key error',
                  HttpStatus.BAD_REQUEST,
                ),
              );
            } else {
              reject(error);
            }
          }
        })
        .on('error', (error) => reject(error));
    });
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    try {
      const createdCategory = new this.categoryModel(createCategoryDto);
      return await createdCategory.save();
    } catch (error) {
      throw new HttpException(
        'Category not created',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllCategory() {
    const categoryData = await this.categoryModel.find();
    if (!categoryData || categoryData.length == 0) {
      throw new NotFoundException('Category data not found!');
    }
    return categoryData;
  }
}
