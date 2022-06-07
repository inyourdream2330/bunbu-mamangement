import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CompensationDto } from './dto/compensation.dto';
import { Compensation } from './entities/compensation.entity';
import { format, subDays, addDays } from 'date-fns';
import { FindCompensationsQueryDto } from './dto/findCompensationQuery.dto';

@Injectable()
export class CompensationsService {
  constructor(
    @InjectRepository(Compensation)
    private compensationRepository: Repository<Compensation>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createCompensation(dto: CompensationDto, id) {
    await this.usersRepository.findOneByOrFail({ id }).catch((err) => {
      throw new InternalServerErrorException(`User id = ${id} not exist`);
    });
    const response = await this.compensationRepository.save({
      ...dto,
      user: id,
    });
    return { data: response, message: 'Create compensation success' };
  }

  async findCompensations(query: FindCompensationsQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const from = query.from || format(subDays(new Date(), 10), 'yyyy-MM-dd');
    const to = query.to || format(addDays(new Date(), 10), 'yyyy-MM-dd');
    const user_id = query.user_id;
    const sort = query.sort || 'DESC';
    const sort_by = query.sort_by || 'id';

    const skip = (page - 1) * limit;
    const builder =
      this.compensationRepository.createQueryBuilder('compensation');
    builder.leftJoinAndSelect('compensation.user', 'user');
    builder.where('compensation.is_deleted = 0');
    builder.andWhere('user.is_deleted = 0');
    builder.andWhere('compensation.date BETWEEN :from AND :to', { from, to });
    if (user_id) {
      builder.andWhere('compensation.user = :user_id', { user_id });
    }

    builder.offset(skip).limit(limit);

    builder.orderBy(`compensation.${sort_by}`, sort);

    const response = await builder.getMany();

    return { data: response, message: 'Find compensations success' };
  }
}
