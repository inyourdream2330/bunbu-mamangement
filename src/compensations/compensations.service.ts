import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { findDateQuery } from '../auth/ultis/common.service';
import { User } from '../users/entities/user.entity';
import { CreateCompensationDto } from './dto/create-compensation.dto';
import { UpdateCompensationDto } from './dto/update-compensation.dto';
import { Compensation } from './entities/compensation.entity';

@Injectable()
export class CompensationsService {
  constructor(
    @InjectRepository(Compensation)
    private compensationRepository: Repository<Compensation>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createCompensation(dto: CreateCompensationDto, id) {
    await this.usersRepository.findOneByOrFail({ id }).catch((err) => {
      throw new InternalServerErrorException(`User id = ${id} not exist`);
    });
    const response = await this.compensationRepository.save({
      ...dto,
      user: id,
    });
    return { data: response, message: 'Create compensation success' };
  }

  async updateCompensation(dto: UpdateCompensationDto, id) {
    const response = await this.compensationRepository.update(
      { id },
      { ...dto },
    );
    return { message: `Compensation id = ${id} update success` };
  }

  async deleteCompensation(id: number) {
    await this.compensationRepository.findOneByOrFail({ id }).catch((err) => {
      throw new InternalServerErrorException(
        `Compensation id = ${id} not exist`,
      );
    });

    const response = await this.compensationRepository.delete({ id });
    return { message: `Compensation id = ${id} delete success` };
  }

  async findCompensations(
    page: number,
    limit: number,
    from: string,
    to: string,
  ) {
    const skip = (page - 1) * limit;
    const response = await this.compensationRepository.find({
      where: {
        date: findDateQuery(new Date(), from, to),
      },
      select: {
        user: { id: true, name: true, email: true },
      },
      relations: {
        user: true,
      },
      skip: skip,
      take: limit,
    });
    return { data: response, message: 'Find compensations success' };
  }
}
