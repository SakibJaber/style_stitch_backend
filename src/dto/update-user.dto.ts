import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  public phone: string;

  @IsOptional()
  @IsString()
  public name: string;

  @IsOptional()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  public password: string;

  @IsOptional()
  @IsString()
  public alterNumber: string;

  @IsOptional()
  @IsString()
  public hint: string;

  @IsOptional()
  @IsString()
  public gender: string;
}
