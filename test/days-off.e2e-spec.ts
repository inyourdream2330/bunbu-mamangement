import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { clearDB } from '../src/auth/ultis/DB.service';
import { TokenService } from '../src/auth/ultis/token.service';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import {
  ADMIN_JWT_PAYLOAD,
  INIT_DAYOFF,
  INIT_USER_STAFF,
  STAFF_JWT_PAYLOAD,
} from '../src/constant/constant';
import { UsersService } from '../src/users/users.service';

describe('Days Off Controller E2E Test', () => {
  let app: INestApplication;
  let tokenService: TokenService;
  let usersService: UsersService;
  const loginBody = {
    email: INIT_USER_STAFF.email,
    password: '1',
    remember: false,
  };
  let loginUser;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    tokenService = moduleFixture.get<TokenService>(TokenService);
    usersService = moduleFixture.get<UsersService>(UsersService);
    await clearDB(['day_off']);
    await clearDB(['user']);
    await app.init();

    const accessToken = await tokenService.createAccessToken(ADMIN_JWT_PAYLOAD);
    const createUser = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(INIT_USER_STAFF)
      .expect(201);
    loginUser = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginBody })
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.message).toBe('Login Success');
      });
  });

  afterAll(async () => {
    await clearDB(['day_off']);
  });
  beforeAll(async () => {});

  it('Create day off success', async () => {
    return await request(app.getHttpServer())
      .post('/days-off')
      .set('Authorization', 'Bearer ' + loginUser.body.data.access_token)
      .send(INIT_DAYOFF)
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        expect(res.body.message).toBe('Create day off success');
      });
  });

  it('Create day off without jwt token', async () => {
    return await request(app.getHttpServer())
      .post('/days-off')
      .send(INIT_DAYOFF)
      .expect(HttpStatus.UNAUTHORIZED)
      .expect((res) => {
        expect(res.body.message).toBe('No auth token');
      });
  });

  it('Find days off success', async () => {
    return await request(app.getHttpServer())
      .get('/days-off')
      .set('Authorization', 'Bearer ' + loginUser.body.data.access_token)
      .query({ page: '1', limit: '10', from: '', to: '', name: '' })
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.message).toBe('Find days off success');
      });
  });

  it('Find days off without token', async () => {
    return await request(app.getHttpServer())
      .get('/days-off')
      .query({ page: '1', limit: '10', from: '', to: '', name: '' })
      .expect(HttpStatus.UNAUTHORIZED)
      .expect((res) => {
        expect(res.body.message).toBe('No auth token');
      });
  });
});
