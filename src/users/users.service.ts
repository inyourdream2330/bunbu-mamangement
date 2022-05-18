import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Like, Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/changePassword-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const [emailExists] = await this.usersRepository.findBy({
      email: createUserDto.email,
    });
    if (emailExists) {
      throw new InternalServerErrorException('Email exist');
    }

    const hashPassword = await argon2.hash('1');
    const response = await this.usersRepository
      .save({ ...createUserDto, password: hashPassword })
      .then((res) => {
        res.code = this.generateUserCode(res.id);
        return this.usersRepository.save(res);
      });
    return {
      statusCode: HttpStatus.CREATED,
      data: response,
      message: 'Create user success',
    };
  }

  async findOneByEmail(email: string) {
    const response = await this.usersRepository.findOneBy({ email });
    return { data: response, message: 'get user' };
  }

  generateUserCode(id: number) {
    const zeroPad = (num, places) => String(num).padStart(places, '0');
    // 6 is the total number character in code
    return 'B' + zeroPad(id, 6);
  }

  async updateHashRefreshToken(id: number, hash_refresh_token: string) {
    return await this.usersRepository.update({ id }, { hash_refresh_token });
  }

  async updatePassword(id: number, changePasswordDto: ChangePasswordDto) {
    try {
      const hashPassword = await argon2.hash(changePasswordDto.password);
      await this.usersRepository.update({ id }, { password: hashPassword });
      return { data: [], message: 'Change Password Success' };
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async findUsers(
    page: number,
    limit: number,
    name: string,
    email: string,
    code: string,
  ) {
    try {
      const skip = (page - 1) * limit || 0;

      const response = await this.usersRepository.find({
        where: {
          name: Like(`%${name}%`),
          email: Like(`%${email}%`),
          code: Like(`%${code}%`),
        },
        order: { id: 'DESC' },
        take: limit,
        skip: skip,
      });

      return { data: response, message: 'Find users success' };
    } catch (err) {
      return { message: err.message };
    }
  }
}
