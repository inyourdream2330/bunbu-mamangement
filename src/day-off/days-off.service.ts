import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DayOffDto } from './dto/day-off.dto';
import { DayOff } from './entities/days-off.entity';

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

  async findOneDayOffById(id: number) {
    const response = await this.daysOffRepository
      .findOneByOrFail({ id })
      .catch(() => {
        throw new InternalServerErrorException(`Day off id = ${id} not exist`);
      });

    return { data: response, message: `Day off id = ${id} get data success` };
  }
}
