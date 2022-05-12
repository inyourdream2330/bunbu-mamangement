import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
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
      throw new BadRequestException('User already exist');
    }

    const hashPassword = await argon2.hash('1');
    const response = await this.usersRepository
      .save({ ...createUserDto, password: hashPassword })
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
    // 6 is the total number character in code
    return 'B' + zeroPad(id, 6);
  }

  async findById(id: number) {
    const response = await this.usersRepository.findOneBy({ id });
    return { data: response, message: 'Find user by id success' };
  }

  async updateHashRefreshToken(id: number, hash_refresh_token: string) {
    return await this.usersRepository.update({ id }, { hash_refresh_token });
  }
}
