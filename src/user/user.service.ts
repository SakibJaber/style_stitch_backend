import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { User } from 'src/models/user.schema';
import { Payload } from 'src/types/payload';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private readonly authService: AuthService, // Inject AuthService
  ) {}

  async findByPayload(payload: Payload) {
    const { phone } = payload;
    return await this.userModel.findOne({ phone });
  }

  async findUserByPhone(phone: string): Promise<User> {
    const user = await this.userModel.findOne({ phone }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ user: User; token: string }> {
    const { phone } = createUserDto;
    const existingUser = await this.userModel.findOne({ phone }).exec();
    if (existingUser) {
      // throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
      const payload = { phone: existingUser.phone };
      const token = await this.authService.signPayload(payload);
      return { user: existingUser, token };
    }
    try {
      const createdUser = new this.userModel(createUserDto);
      await createdUser.save();
      const payload = { phone: createdUser.phone };
      const token = await this.authService.signPayload(payload);
      return { user: createdUser, token };
    } catch (error) {
      throw new HttpException(
        'User not created',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateByPhone(
    phone: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userModel
      .findOneAndUpdate({ phone }, updateUserDto, { new: true })
      .exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
  async findUserByPhoneN(phone: string): Promise<User> {
    return this.userModel.findOne({ phone }).exec();
  }

  // async findUserByPhone(phone: string, updateUserDto: UpdateUserDto): Promise<User> {
   
  //   const user = await this.userModel.findOne({ phone }).exec();
  //   if (!user) {
  //     throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //   }
  //   return user;
  // }

  async findUserByPhoneAndUpdate(
    phone: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userModel
      .findOneAndUpdate({ phone }, updateUserDto, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException(`User with phone number ${phone} not found`);
    }
    return user;
  }

  async findByLogin(UserDTO: CreateUserDto) {
    const { phone } = UserDTO;
    const user = await this.userModel.findOne({ phone }).exec();
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }
    return user;
  }
}
