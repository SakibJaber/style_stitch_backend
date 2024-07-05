import { IsString, IsArray, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class CreateLeafCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsBoolean()
  isExpandable: boolean;
}

class CreateSubCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsBoolean()
  isExpandable: boolean;

  @IsArray()
  @Type(() => CreateLeafCategoryDto)
  @IsOptional()
  leafCategory?: CreateLeafCategoryDto[];
}

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  backgroundColor: string;

  @IsBoolean()
  isExpandable: boolean;

  @IsArray()
  @Type(() => CreateSubCategoryDto)
  @IsOptional()
  subCategory?: CreateSubCategoryDto[];
}

