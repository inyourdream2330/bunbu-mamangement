import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Like, Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/changePassword-user.dto';
import { UserDto } from './dto/user.dto';
import { findUsersQueryDto } from './dto/findUserQuery.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: UserDto) {
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
    return { data: response, message: 'Get user by email success' };
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

  async updateUser(id: number, userDto: UserDto) {
    const response = await this.usersRepository.save({ id, ...userDto });
    return { data: response, message: `Update user ${id} success` };
  }

  async findUsers(query: findUsersQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const name = query.name || '';
    const email = query.email || '';
    const code = query.code || '';
    const sort = query.sort || 'DESC';
    const sort_by = query.sort_by || 'id';

    const skip = (page - 1) * limit;
    const builder = this.usersRepository.createQueryBuilder('user');

    builder.where(
      'user.name LIKE :name AND user.email LIKE :email AND user.code LIKE :code',
      { name: `%${name}%`, email: `%${email}%`, code: `%${code}%` },
    );

    builder.offset(skip).limit(limit);

    builder.orderBy(`user.${sort_by}`, sort);

    const response = await builder.getMany();

    return { data: response, message: 'Find users success' };
  }
  async findOneById(id: number) {
    const response = await this.usersRepository.findOneBy({ id });
    return { data: response, message: 'Get user by id success' };
  }

  async deleteUser(id: number) {
    await this.usersRepository.findOneByOrFail({ id }).catch(() => {
      throw new NotFoundException(`User id = ${id} not exist`);
    });

    const response = await this.usersRepository.update(
      { id },
      { is_deleted: true },
    );

    return { data: response, message: `User id = ${id} delete success` };
  }
}
