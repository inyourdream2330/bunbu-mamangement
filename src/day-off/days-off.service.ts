import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, MoreThan, Repository } from 'typeorm';
import { DayOffDto } from './dto/day-off.dto';
import { DayOff } from './entities/days-off.entity';
import { format, subDays, addDays } from 'date-fns';
import { DAYOFF_SAMPLE_TEST_DATA } from '../constant/sampleTestData';

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
    const sort = query.sort || 'DESC';
    const sort_by = query.sort_by || 'id';

    const skip = (page - 1) * limit;

    const [response, total] = await this.daysOffRepository.findAndCount({
      where: {
        date: Between(from, to),
        user: {
          is_deleted: false,
        },
        is_deleted: false,
      },
      order: {
        [sort_by]: sort,
      },
      skip: skip,
      take: limit,
    });

    return { data: response, total, message: 'Find days off success' };
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

  async importDataForTest(userId) {
    const data = DAYOFF_SAMPLE_TEST_DATA.map((data) => ({
      ...data,
      user: userId,
    }));
    return await this.daysOffRepository.save(data);
  }
}
