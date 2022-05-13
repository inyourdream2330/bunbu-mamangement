import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { clearDB } from '../src/auth/ultis/DB.service';
import { TokenService } from '../src/auth/ultis/token.service';
import {
  ADMIN_JWT_PAYLOAD,
  INIT_USER_STAFF,
  STAFF_JWT_PAYLOAD,
} from '../src/constant/constant';
import { UsersController } from '../src/users/users.controller';
import { AppModule } from './../src/app.module';

describe('UsersController E2E Test', () => {
  let app: INestApplication;
  let tokenService: TokenService;
  let usersController: UsersController;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    tokenService = moduleFixture.get<TokenService>(TokenService);
    usersController = moduleFixture.get<UsersController>(UsersController);
    await clearDB(['user']);
    await app.init();
  });

  afterAll(async () => {
    await clearDB(['user']);
  });

  it('Should return an Unauthorized exception', async () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(INIT_USER_STAFF)
      .expect(401);
  });

  it('Should return an Unauthorized exception, message Permission denied', async () => {
    const accessToken = await tokenService.createAccessToken(STAFF_JWT_PAYLOAD);
    return request(app.getHttpServer())
      .post('/users')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(INIT_USER_STAFF)
      .expect(HttpStatus.UNAUTHORIZED)
      .expect((res) => {
        expect(res.body.message).toBe('Permission denied');
      });
  });

  it('Should create user', async () => {
    const accessToken = await tokenService.createAccessToken(ADMIN_JWT_PAYLOAD);
    return request(app.getHttpServer())
      .post('/users')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(INIT_USER_STAFF)
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        expect(res.body.data).toMatchObject(INIT_USER_STAFF);
        expect(res.body.message).toBe('Create user success');
      });
  });

  it('Should not create user becouse dupplicate user email', async () => {
    const accessToken = await tokenService.createAccessToken(ADMIN_JWT_PAYLOAD);
    await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(INIT_USER_STAFF)
      .expect(201);

    return await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(INIT_USER_STAFF)
      .expect(HttpStatus.INTERNAL_SERVER_ERROR)
      .expect((res) => {
        expect(res.body.message).toBe('Email exist');
      });
  });
});
