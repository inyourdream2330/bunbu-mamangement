import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThan, Repository } from 'typeorm';
import { findDateQuery } from '../auth/ultis/common.service';
import { User } from '../users/entities/user.entity';
import { CreateDayOffDto } from './dto/create-day-off.dto';
import { UpdateDayOffDto } from './dto/update-day-off.dto';
import { updateStatusDto } from './dto/update-status.dto';
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
    await this.usersRepository.findOneByOrFail({ id }).catch((err) => {
      throw new InternalServerErrorException(`User id = ${id} not exist`);
    });
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
    user_id: number,
  ) {
    const skip = (page - 1) * limit;
    const response = await this.daysOffRepository.find({
      select: {
        user: { id: true, name: true, email: true },
      },
      where: {
        date: findDateQuery(new Date(), from, to),
        user: {
          name: Like(`%${name}%`),
          id: user_id >= 0 ? user_id : MoreThan(user_id),
        },
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
    const response = await this.daysOffRepository.update(
      { id },
      {
        ...updateDayOffDto,
      },
    );
    return { message: `Update day off id = ${id} success` };
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

  // async findDaysOffByUser(
  //   id: number,
  //   page: number,
  //   limit: number,
  //   from: string,
  //   to: string,
  // ) {
  // const isUser = (await this.usersService.findOneById(id)).data;
  // if (!isUser) {
  //   throw new InternalServerErrorException(`User id = ${id} not exist`);
  // }
  //   await this.usersRepository.findOneByOrFail({ id }).catch((err) => {
  //     throw new InternalServerErrorException(`User id = ${id} not exist`);
  //   });
  //   const skip = (page - 1) * limit || 0;
  //   const response = await this.daysOffRepository.find({
  //     select: {
  //       user: { id: true, name: true, email: true },
  //     },
  //     where: {
  //       date: findDateQuery(new Date(), from, to),
  //       user: {
  //         id,
  //       },
  //     },
  //     relations: {
  //       user: true,
  //     },
  //     skip: skip,
  //     take: limit,
  //   });
  //   return {
  //     data: response,
  //     message: `Find day off by user_id = ${id} success`,
  //   };
  // }

  async deleteDaysOff(id: number) {
    await this.daysOffRepository.findOneByOrFail({ id }).catch((err) => {
      throw new InternalServerErrorException(`Day off id = ${id} not exist`);
    });

    const response = await this.daysOffRepository.delete({ id });
    return { message: `Delete day off id = ${id} success` };
  }

  async updateStatus(id: number, dto: updateStatusDto) {
    await this.daysOffRepository.findOneByOrFail({ id }).catch((err) => {
      throw new InternalServerErrorException(`Day off id = ${id} not exist`);
    });
    // const isWaiting =
    //   (await this.daysOffRepository.findOneBy({ id })).status !== 0;
    // if (isWaiting) {
    //   throw new InternalServerErrorException(
    //     'Your day off request are reject or accepted',
    //   );
    // }

    await this.daysOffRepository.update({ id }, { ...dto });
    return {
      message: `Day off id = ${id} update status success `,
    };
  }

  // findDateQuery = (date: Date, from: string, to: string) =>
  //   // Default get from 10 days ago from now and to 10 days later from now, can change in future
  //   Between(
  //     isValid(new Date(from)) ? from : format(subDays(date, 10), 'yyyy-MM-dd'),
  //     isValid(new Date(to)) ? to : format(addDays(date, 10), 'yyyy-MM-dd'),
  //   );
}
