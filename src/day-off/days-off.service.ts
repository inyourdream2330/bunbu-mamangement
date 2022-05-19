import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addDays, subDays, format } from 'date-fns';
import { Between, Like, Repository } from 'typeorm';
import { CreateDayOffDto } from './dto/create-day-off.dto';
import { UpdateDayOffDto } from './dto/update-day-off.dto';
import { DayOff } from './entities/days-off.entity';

@Injectable()
export class DaysOffService {
  constructor(
    @InjectRepository(DayOff)
    private daysOffRepository: Repository<DayOff>,
  ) {}

  async createDayOff(createDayOffDto: CreateDayOffDto, id) {
    const response = await this.daysOffRepository.save({
      ...createDayOffDto,
      user: id,
    });
    return { data: response, message: 'Create day off success' };
  }

  async findDaysOff(
    page: number,
    limit: number,
    from: string,
    to: string,
    name: string,
  ) {
    const skip = (page - 1) * limit || 0;
    // Default get from 10 days ago from now and to 10 days later from now, can change in future
    const findDate = (date: Date) =>
      Between(
        from ? from : format(subDays(date, 10), 'yyyy-MM-dd'),
        to ? to : format(addDays(date, 10), 'yyyy-MM-dd'),
      );
    const response = await this.daysOffRepository.find({
      select: {
        user: { id: true, name: true, email: true },
      },
      where: {
        date: findDate(new Date()),
        user: { name: Like(`%${name}%`) },
      },
      relations: {
        user: true,
      },
    });
    return { data: response, message: 'Find days off success' };
  }

  async updateDayOff(id, updateDayOffDto: UpdateDayOffDto) {
    const response = this.daysOffRepository.save({
      ...updateDayOffDto,
      id,
    });
    return { data: response, message: `Update day off ${id} success` };
  }
}
