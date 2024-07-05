import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ProductService } from './product.service';
import express, { Request, Response } from 'express';
import { CreateCategoryDto } from 'src/dto/create-category.dto';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService

  ) {}

  @Get('getAll')
  public async getAllProducts(@Res() response) {
    try {
      const productData = await this.productService.getAllProductsDetails();
      return response.status(HttpStatus.OK).json({
        message: 'All product data found successfully',
        productData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'public/files',
        filename: (req, file, callback) => {
          const random = Math.floor(Math.random() * 9000 + 1);
          callback(null, `${random}-${file.originalname}`);
        },
      }),
    }),
  )
  public async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() response: Response,
  ) {
    console.log(file);

    if (!file) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'No file uploaded!',
      });
    }

    try {
      await this.productService.parseCsv(file.path);
      return response.status(HttpStatus.OK).json({
        message: 'File uploaded and processed successfully!',
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error processing file!',
        error: error.message,
      });
    }
  }

  @Post('category')
  public async addCategory(@Res() response,@Body() createCategoryDto: CreateCategoryDto){
    const category= await this.productService.createCategory(createCategoryDto);
    return response.status(HttpStatus.ACCEPTED).json({
      message: 'Category Created Successfully',
      category,
    });
  }

  @Get('category/getAll')
  public async getAllCategory(@Res() response) {
    try {
      const productCategory = await this.productService.getAllCategory();
      return response.status(HttpStatus.OK).json({
        message: 'All category data found successfully',
        productCategory,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
 
  
}
