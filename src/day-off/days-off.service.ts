import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addDays, format, isValid, subDays } from 'date-fns';
import { Between, Like, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateDayOffDto } from './dto/create-day-off.dto';
import { UpdateDayOffDto } from './dto/update-day-off.dto';
import { DayOff } from './entities/days-off.entity';

@Injectable()
export class DaysOffService {
  constructor(
    @InjectRepository(DayOff)
    private daysOffRepository: Repository<DayOff>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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
    const skip = (page - 1) * limit;
    const response = await this.daysOffRepository.find({
      select: {
        user: { id: true, name: true, email: true },
      },
      where: {
        date: this.findDateQuery(new Date(), from, to),
        user: { name: Like(`%${name}%`) },
      },
      relations: {
        user: true,
      },
      skip: skip,
      take: limit,
    });
    return { data: response, message: 'Find days off success' };
  }

  async updateDayOff(id: number, updateDayOffDto: UpdateDayOffDto) {
    const response = await this.daysOffRepository.save({
      id,
      ...updateDayOffDto,
    });
    return { data: response, message: `Update day off id = ${id} success` };
  }

  async findDayOffById(id: number) {
    const response = await this.daysOffRepository.findOneBy({ id });
    if (!response) {
      throw new InternalServerErrorException(
        `Find fail, day off id = ${id} not exist`,
      );
    }
    return { data: response, message: `Find day off by id = ${id} success` };
  }

  async findDaysOffByUser(
    id: number,
    page: number,
    limit: number,
    from: string,
    to: string,
  ) {
    // const isUser = (await this.usersService.findOneById(id)).data;
    // if (!isUser) {
    //   throw new InternalServerErrorException(`User id = ${id} not exist`);
    // }
    await this.usersRepository.findOneByOrFail({ id }).catch((err) => {
      throw new InternalServerErrorException(`User id = ${id} not exist`);
    });
    const skip = (page - 1) * limit || 0;
    const response = await this.daysOffRepository.find({
      select: {
        user: { id: true, name: true, email: true },
      },
      where: {
        date: this.findDateQuery(new Date(), from, to),
        user: {
          id,
        },
      },
      relations: {
        user: true,
      },
      skip: skip,
      take: limit,
    });
    return {
      data: response,
      message: `Find day off by user_id = ${id} success`,
    };
  }

  async deleteDaysOff(id: number) {
    const isDayOff = await this.daysOffRepository.findOneBy({ id });
    if (!isDayOff) {
      throw new InternalServerErrorException(`Day off id = ${id} not exist`);
    }
    const response = await this.daysOffRepository.delete({ id });
    return { message: `Delete day off id = ${id} success` };
  }

  // async updateStatus()

  findDateQuery = (date: Date, from: string, to: string) =>
    // Default get from 10 days ago from now and to 10 days later from now, can change in future
    Between(
      isValid(new Date(from)) ? from : format(subDays(date, 10), 'yyyy-MM-dd'),
      isValid(new Date(to)) ? to : format(addDays(date, 10), 'yyyy-MM-dd'),
    );
}
