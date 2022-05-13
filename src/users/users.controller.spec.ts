import {
  BadRequestException,
  HttpStatus,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { clearDB } from '../auth/ultis/DB.service';
import { AppModule } from '../app.module';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersController } from './users.controller';
import { Response } from 'express';

const createDto: CreateUserDto = {
  name: 'admin1234z5',
  email: 'admin12345z@gmail.com',
  gender: 1,
  id_card: 'id_card',
  address: 'Hà Nội',
  joining_date: '2021-11-11',
  dob: '2021-11-11',
  status: 1,
  phone: '12345678',
  contract_type: 1,
  official_date: '2021-11-11',
  role: 1,
  position: 1,
};

describe('UsersController', () => {
  let controller: UsersController;
  let res: Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(async () => {
    await clearDB(['user']);
  });

  it('Create success user', async () => {
    const response = await controller.create(createDto);
    expect(response.statusCode).toEqual(HttpStatus.CREATED);
  });

  it('Create dupplicated user', async () => {
    const response = await controller.create(createDto).then(() => {
      return controller.create(createDto);
    });

    console.log(response);

    expect(response).toThrow(InternalServerErrorException);
  });
});
