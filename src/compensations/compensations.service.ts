import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CompensationDto } from './dto/compensation.dto';
import { Compensation } from './entities/compensation.entity';

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

  async deleteCompensation(id: number) {
    await this.compensationRepository.findOneByOrFail({ id }).catch(() => {
      throw new InternalServerErrorException(
        `Compensation id = ${id} not exist`,
      );
    });

    const response = await this.compensationRepository.update(
      { id },
      { is_deleted: true },
    );
    return { message: `Compensation id = ${id} delete success` };
  }
}
