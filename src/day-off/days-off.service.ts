import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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

  async deleteDayOff(id) {
    await this.daysOffRepository.findOneByOrFail({ id }).catch((err) => {
      throw new NotFoundException(`Day off id = ${id} not exist`);
    });

    const response = await this.daysOffRepository.update(
      { id },
      { is_deleted: true },
    );

    return { message: `Day off id = ${id} delete success` };
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
