import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DayOffDto } from './dto/day-off.dto';
import { DayOff } from './entities/days-off.entity';
import { format, subDays, addDays } from 'date-fns';

@Injectable()
export class DaysOffService {
  constructor(
    @InjectRepository(DayOff)
    private daysOffRepository: Repository<DayOff>,
  ) {}

  async createDayOff(createDayOffDto: DayOffDto, id) {
    const response = await this.daysOffRepository.save({
      ...createDayOffDto,
      user: id,
    });
    return { data: response, message: 'Create day off success' };
  }

  async findDaysOff(query) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const from = query.from || format(subDays(new Date(), 10), 'yyyy-MM-dd');
    const to = query.to || format(addDays(new Date(), 10), 'yyyy-MM-dd');
    const user_id = query.user_id;
    const sort = query.sort || 'DESC';
    const sort_by = query.sort_by || 'id';

    const skip = (page - 1) * limit;
    const builder = this.daysOffRepository.createQueryBuilder('dayoff');
    builder.leftJoinAndSelect('dayoff.user', 'user');
    builder.where('dayoff.is_deleted = 0');
    builder.andWhere('user.is_deleted = 0');
    builder.andWhere('dayoff.date BETWEEN :from AND :to', { from, to });
    if (user_id) {
      builder.andWhere('dayoff.user = :user_id', { user_id });
    }

    builder.offset(skip).limit(limit);

    builder.orderBy(`dayoff.${sort_by}`, sort);

    const response = await builder.getMany();

    return { data: response, message: 'Find days off success' };
  }

  async updateDayOff(id: number, dto: DayOffDto) {
    await this.daysOffRepository.findOneByOrFail({ id }).catch((err) => {
      throw new InternalServerErrorException(`Day off id = ${id} not exist`);
    });
    const response = await this.daysOffRepository.update(
      { id },
      {
        ...dto,
      },
    );
    return { message: `Update day off id = ${id} success` };
  }
}
