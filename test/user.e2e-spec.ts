import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { clearDB } from '../src/auth/ultis/DB.service';
import { TokenService } from '../src/auth/ultis/token.service';
import {
  ADMIN_JWT_PAYLOAD,
  INIT_USER_STAFF,
  LOGIN_BODY_ADMIN,
  STAFF_JWT_PAYLOAD,
  UPDATE_USER_DATA,
} from '../src/constant/constant';
import { UsersController } from '../src/users/users.controller';
import { AppModule } from './../src/app.module';

describe('UsersController E2E Test', () => {
  let app: INestApplication;
  let tokenService: TokenService;
  let usersController: UsersController;
  let accessTokenAdmin;
  let accessTokenStaff;
  const loginBody = {
    email: INIT_USER_STAFF.email,
    password: '1',
    remember: false,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    tokenService = moduleFixture.get<TokenService>(TokenService);
    usersController = moduleFixture.get<UsersController>(UsersController);

    accessTokenAdmin = await tokenService.createAccessToken(ADMIN_JWT_PAYLOAD);
    accessTokenStaff = await tokenService.createAccessToken(STAFF_JWT_PAYLOAD);

    await clearDB(['user']);
    await app.init();
  });

  afterAll(async () => {
    await clearDB(['user']);
  });

  it('Should return an Unauthorized exception, missing token', async () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(INIT_USER_STAFF)
      .expect(401);
  });

  it('Create user fail, message Permission denied', async () => {
    return request(app.getHttpServer())
      .post('/users')
      .set('Authorization', 'Bearer ' + accessTokenStaff)
      .send(INIT_USER_STAFF)
      .expect(HttpStatus.UNAUTHORIZED)
      .expect((res) => {
        expect(res.body.message).toBe('Permission denied');
      });
  });

  it('Should  user success', async () => {
    return request(app.getHttpServer())
      .post('/users')
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send(INIT_USER_STAFF)
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        expect(res.body.data).toMatchObject(INIT_USER_STAFF);
        expect(res.body.message).toBe('Create user success');
      });
  });

  it('create user fail, dupplicate user email', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send(INIT_USER_STAFF)
      .expect(201);

    return await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send(INIT_USER_STAFF)
      .expect(HttpStatus.INTERNAL_SERVER_ERROR)
      .expect((res) => {
        expect(res.body.message).toBe('Email exist');
      });
  });

  it('Create user with missing required field', async () => {
    // Missing name
    await request(app.getHttpServer())
      .post(`/users`)
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send({ ...UPDATE_USER_DATA, name: '' })
      .expect(HttpStatus.BAD_REQUEST);
    // Missing gender
    await request(app.getHttpServer())
      .post(`/users`)
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send({ ...UPDATE_USER_DATA, gender: '' })
      .expect(HttpStatus.BAD_REQUEST);
    // Missing email
    await request(app.getHttpServer())
      .post(`/users`)
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send({ ...UPDATE_USER_DATA, email: '' })
      .expect(HttpStatus.BAD_REQUEST);
    // Missing id_card
    await request(app.getHttpServer())
      .post(`/users`)
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send({ ...UPDATE_USER_DATA, id_card: '' })
      .expect(HttpStatus.BAD_REQUEST);
    // Missing address
    await request(app.getHttpServer())
      .post(`/users`)
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send({ ...UPDATE_USER_DATA, address: '' })
      .expect(HttpStatus.BAD_REQUEST);
    // Missing joining_date
    await request(app.getHttpServer())
      .post(`/users`)
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send({ ...UPDATE_USER_DATA, joining_date: '' })
      .expect(HttpStatus.BAD_REQUEST);
    // Missing dob
    await request(app.getHttpServer())
      .post(`/users`)
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send({ ...UPDATE_USER_DATA, dob: '' })
      .expect(HttpStatus.BAD_REQUEST);

    // Missing status
    await request(app.getHttpServer())
      .post(`/users`)
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send({ ...UPDATE_USER_DATA, status: '' })
      .expect(HttpStatus.BAD_REQUEST);
    // Missing phone
    await request(app.getHttpServer())
      .post(`/users`)
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send({ ...UPDATE_USER_DATA, phone: '' })
      .expect(HttpStatus.BAD_REQUEST);
    // Missing contract_type
    await request(app.getHttpServer())
      .post(`/users`)
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send({ ...UPDATE_USER_DATA, contract_type: '' })
      .expect(HttpStatus.BAD_REQUEST);
    // Missing official_date
    await request(app.getHttpServer())
      .post(`/users`)
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send({ ...UPDATE_USER_DATA, official_date: '' })
      .expect(HttpStatus.BAD_REQUEST);
    // Missing role
    await request(app.getHttpServer())
      .post(`/users`)
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send({ ...UPDATE_USER_DATA, role: '' })
      .expect(HttpStatus.BAD_REQUEST);
    // Missing position
    await request(app.getHttpServer())
      .post(`/users`)
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send({ ...UPDATE_USER_DATA, position: '' })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('Change password', async () => {
    const createUser = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send(INIT_USER_STAFF);

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginBody, remember: true })
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.message).toBe('Login Success');
      });

    const changePassword = await request(app.getHttpServer())
      .post('/users/change-password')
      .set('Authorization', 'Bearer ' + login.body.data.access_token)
      .send({
        password: 'super-secret-password',
      })
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.message).toBe('Change Password Success');
      });
  });

  it('Update user', async () => {
    const createUser = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send(INIT_USER_STAFF);

    return await request(app.getHttpServer())
      .put(`/users/${createUser.body.data.id}`)
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send(UPDATE_USER_DATA)
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.message).toBe(
          `Update user ${createUser.body.data.id} success`,
        );
      });
  });

  it('Update user with missing required field', async () => {
    const createUser = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send(INIT_USER_STAFF);
    // Missing name
    await request(app.getHttpServer())
      .put(`/users/${createUser.body.data.id}`)
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send({ ...UPDATE_USER_DATA, name: '' })
      .expect(HttpStatus.BAD_REQUEST);
    // Missing gender
    await request(app.getHttpServer())
      .put(`/users/${createUser.body.data.id}`)
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send({ ...UPDATE_USER_DATA, gender: '' })
      .expect(HttpStatus.BAD_REQUEST);
    // Missing email
    await request(app.getHttpServer())
      .put(`/users/${createUser.body.data.id}`)
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send({ ...UPDATE_USER_DATA, email: '' })
      .expect(HttpStatus.BAD_REQUEST);
    // Missing id_card
    await request(app.getHttpServer())
      .put(`/users/${createUser.body.data.id}`)
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send({ ...UPDATE_USER_DATA, id_card: '' })
      .expect(HttpStatus.BAD_REQUEST);
    // Missing address
    await request(app.getHttpServer())
      .put(`/users/${createUser.body.data.id}`)
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send({ ...UPDATE_USER_DATA, address: '' })
      .expect(HttpStatus.BAD_REQUEST);
    // Missing joining_date
    await request(app.getHttpServer())
      .put(`/users/${createUser.body.data.id}`)
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send({ ...UPDATE_USER_DATA, joining_date: '' })
      .expect(HttpStatus.BAD_REQUEST);
    // Missing dob
    await request(app.getHttpServer())
      .put(`/users/${createUser.body.data.id}`)
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send({ ...UPDATE_USER_DATA, dob: '' })
      .expect(HttpStatus.BAD_REQUEST);

    // Missing status
    await request(app.getHttpServer())
      .put(`/users/${createUser.body.data.id}`)
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send({ ...UPDATE_USER_DATA, status: '' })
      .expect(HttpStatus.BAD_REQUEST);
    // Missing phone
    await request(app.getHttpServer())
      .put(`/users/${createUser.body.data.id}`)
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send({ ...UPDATE_USER_DATA, phone: '' })
      .expect(HttpStatus.BAD_REQUEST);
    // Missing contract_type
    await request(app.getHttpServer())
      .put(`/users/${createUser.body.data.id}`)
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send({ ...UPDATE_USER_DATA, contract_type: '' })
      .expect(HttpStatus.BAD_REQUEST);
    // Missing official_date
    await request(app.getHttpServer())
      .put(`/users/${createUser.body.data.id}`)
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send({ ...UPDATE_USER_DATA, official_date: '' })
      .expect(HttpStatus.BAD_REQUEST);
    // Missing role
    await request(app.getHttpServer())
      .put(`/users/${createUser.body.data.id}`)
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send({ ...UPDATE_USER_DATA, role: '' })
      .expect(HttpStatus.BAD_REQUEST);
    // Missing position
    await request(app.getHttpServer())
      .put(`/users/${createUser.body.data.id}`)
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send({ ...UPDATE_USER_DATA, position: '' })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('Update user without permission', async () => {
    const createUser = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send(INIT_USER_STAFF);

    return await request(app.getHttpServer())
      .put(`/users/${createUser.body.data.id}`)
      .set('Authorization', 'Bearer ' + accessTokenStaff)
      .send(UPDATE_USER_DATA)
      .expect(HttpStatus.UNAUTHORIZED)
      .expect((res) => {
        expect(res.body.message).toBe('Permission denied');
      });
  });
});
