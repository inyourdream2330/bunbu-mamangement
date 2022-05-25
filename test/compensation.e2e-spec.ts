import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { clearDB } from '../src/auth/ultis/DB.service';
import { TokenService } from '../src/auth/ultis/token.service';
import { CompensationsService } from '../src/compensations/compensations.service';
import { INIT_COMPENSATIONS, INIT_USER_STAFF } from '../src/constant/constant';
import { UsersService } from '../src/users/users.service';

describe('Days Off Controller E2E Test', () => {
  let app: INestApplication;
  let tokenService: TokenService;
  let compensationsService: CompensationsService;
  let usersService: UsersService;
  let authService: AuthService;

  let accessToken;
  let createUser;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    tokenService = moduleFixture.get<TokenService>(TokenService);
    compensationsService =
      moduleFixture.get<CompensationsService>(CompensationsService);
    usersService = moduleFixture.get<UsersService>(UsersService);
    authService = moduleFixture.get<AuthService>(AuthService);
    await clearDB(['day_off', 'user']);
    await app.init();

    createUser = await usersService.create(INIT_USER_STAFF);
    accessToken = await tokenService.createAccessToken(createUser);
  });

  afterAll(async () => {
    await clearDB(['compensation', 'user']);
  });
  beforeAll(async () => {});

  it('Create compensation success', async () => {
    return await request(app.getHttpServer())
      .post(`/compensations`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send(INIT_COMPENSATIONS)
      .expect(HttpStatus.CREATED);
  });

  it('Create compensation fail without token', async () => {
    return await request(app.getHttpServer())
      .post(`/compensations`)
      //   .set('Authorization', 'Bearer ' + accessToken)
      .send(INIT_COMPENSATIONS)
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('Update compensation success', async () => {
    const createCompensation = await compensationsService.createCompensation(
      INIT_COMPENSATIONS,
      createUser.data.id,
    );
    return await request(app.getHttpServer())
      .put(`/compensations/${createCompensation.data.id}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send(INIT_COMPENSATIONS)
      .expect(HttpStatus.OK);
  });
  it('Update compensation fail, without token', async () => {
    const createCompensation = await compensationsService.createCompensation(
      INIT_COMPENSATIONS,
      createUser.data.id,
    );
    return await request(app.getHttpServer())
      .put(`/compensations/${createCompensation.data.id}`)
      // .set('Authorization', 'Bearer ' + accessToken)
      .send(INIT_COMPENSATIONS)
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('Update compensation fail, with not exist compensation', async () => {
    const fakeCompensationId = -1;
    return await request(app.getHttpServer())
      .put(`/compensations/${fakeCompensationId}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send(INIT_COMPENSATIONS)
      .expect(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('Delete compensation success', async () => {
    const createCompensation = await compensationsService.createCompensation(
      INIT_COMPENSATIONS,
      createUser.data.id,
    );
    return await request(app.getHttpServer())
      .delete(`/compensations/${createCompensation.data.id}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(HttpStatus.OK);
  });

  it('Delete compensation fail, without token', async () => {
    const createCompensation = await compensationsService.createCompensation(
      INIT_COMPENSATIONS,
      createUser.data.id,
    );
    return await request(app.getHttpServer())
      .delete(`/compensations/${createCompensation.data.id}`)
      // .set('Authorization', 'Bearer ' + accessToken)
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('Delete compensation fail, with not exist compensation', async () => {
    const fakeCompensationId = -1;
    return await request(app.getHttpServer())
      .delete(`/compensations/${fakeCompensationId}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('Find compensation', async () => {
    const createCompensation = await compensationsService.createCompensation(
      INIT_COMPENSATIONS,
      createUser.data.id,
    );

    return await request(app.getHttpServer())
      .get('/compensations')
      .set('Authorization', 'Bearer ' + accessToken)
      .query({
        page: '1',
        limit: '10',
        from: '',
        to: '',
        name: '',
        user_id: '-1',
      })
      .expect(HttpStatus.OK);
  });
});
