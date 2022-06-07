import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { OvertimeDto } from './dto/overtime.dto';
import { Overtime } from './entities/overtime.entity';

@Injectable()
export class OvertimesService {
  constructor(
    @InjectRepository(Overtime)
    private overtimesRepository: Repository<Overtime>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createOvertime(dto: OvertimeDto, id) {
    await this.usersRepository.findOneByOrFail({ id }).catch(() => {
      throw new InternalServerErrorException(`User id = ${id} not exist`);
    });

    const response = await this.overtimesRepository.save({ ...dto, user: id });
    return { data: response, message: 'Create overtime success' };
  }
}
