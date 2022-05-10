import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as argon2 from 'argon2';
import { Response } from 'express';

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
      throw new BadRequestException('User already exist');
    }

    const hashPassword = await argon2.hash(createUserDto.password);
    createUserDto.password = hashPassword;
    const response = await this.usersRepository
      .save(createUserDto)
      .then((res) => {
        res.code = this.generateUserCode(res.id);
        return this.usersRepository.save(res);
      });
    return { data: response, message: 'Create user success' };
  }

  async findOneByEmail(email: string) {
    const response = await this.usersRepository.findOneBy({ email });
    return { data: response, message: 'get user' };
  }

  generateUserCode(id: number) {
    const zeroPad = (num, places) => String(num).padStart(places, '0');
    // 6 is the max number character in code
    return 'B' + zeroPad(id, 6);
  }
}
