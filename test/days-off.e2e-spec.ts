import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { clearDB } from '../src/auth/ultis/DB.service';
import { TokenService } from '../src/auth/ultis/token.service';
import {
  ADMIN_JWT_PAYLOAD,
  INIT_DAYOFF,
  INIT_USER_STAFF,
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
  let createUser;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    tokenService = moduleFixture.get<TokenService>(TokenService);
    usersService = moduleFixture.get<UsersService>(UsersService);
    await clearDB(['day_off', 'user']);
    await app.init();

    const accessToken = await tokenService.createAccessToken(ADMIN_JWT_PAYLOAD);
    createUser = await request(app.getHttpServer())
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
      .query({
        page: '1',
        limit: '10',
        from: '2022-01-01',
        to: '2022-12-31',
        name: '',
      })
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

  it('find days off :  Query from - to not is date format -- > use default values (10d ago 10d before from now)', async () => {
    return await request(app.getHttpServer())
      .get('/days-off')
      .set('Authorization', 'Bearer ' + loginUser.body.data.access_token)
      .query({
        page: '1',
        limit: '10',
        from: 'super unformed from',
        to: 'super unformed to',
        name: '',
      })
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.message).toBe('Find days off success');
      });
  });

  it('Update day off success', async () => {
    const createDaysOf = await request(app.getHttpServer())
      .post('/days-off')
      .set('Authorization', 'Bearer ' + loginUser.body.data.access_token)
      .send(INIT_DAYOFF)
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        expect(res.body.message).toBe('Create day off success');
      });

    return await request(app.getHttpServer())
      .put(`/days-off/${createDaysOf.body.data.id}`)
      .set('Authorization', 'Bearer ' + loginUser.body.data.access_token)
      .send({ ...INIT_DAYOFF, reasons: 'Reasons updated' })
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.message).toBe(
          `Update day off id = ${res.body.data.id} success`,
        );
        expect(res.body.data.reasons).toBe('Reasons updated');
      });
  });

  it('Update day off without token', async () => {
    const createDaysOf = await request(app.getHttpServer())
      .post('/days-off')
      .set('Authorization', 'Bearer ' + loginUser.body.data.access_token)
      .send(INIT_DAYOFF)
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        expect(res.body.message).toBe('Create day off success');
      });

    const updateWithoutToken = await request(app.getHttpServer())
      .put(`/days-off/${createDaysOf.body.data.id}`)
      // .set('Authorization', 'Bearer ' + loginUser.body.data.access_token)
      .send({ ...INIT_DAYOFF, reasons: 'Reasons updated' })
      .expect(HttpStatus.UNAUTHORIZED)
      .expect((res) => {
        expect(res.body.message).toBe('No auth token');
      });
  });

  it('Find day off by id', async () => {
    const createDaysOf = await request(app.getHttpServer())
      .post('/days-off')
      .set('Authorization', 'Bearer ' + loginUser.body.data.access_token)
      .send(INIT_DAYOFF)
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        expect(res.body.message).toBe('Create day off success');
      });

    const findDayOff = await request(app.getHttpServer())
      .get(`/days-off/${createDaysOf.body.data.id}`)
      .set('Authorization', 'Bearer ' + loginUser.body.data.access_token)
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.data).toEqual(expect.objectContaining(INIT_DAYOFF));
      });
  });
  it('Find day off by not exist id', async () => {
    const fakeId = -1;
    const findDayOff = await request(app.getHttpServer())
      .get(`/days-off/${fakeId}`)
      .set('Authorization', 'Bearer ' + loginUser.body.data.access_token)
      .expect(HttpStatus.INTERNAL_SERVER_ERROR)
      .expect((res) => {
        expect(res.body.message).toBe(
          `Find fail, day off id = ${fakeId} not exist`,
        );
      });
  });

  it('Find day off by id without token', async () => {
    const fakeId = -1;
    return await request(app.getHttpServer())
      .get(`/days-off/${fakeId}`)
      .expect(HttpStatus.UNAUTHORIZED)
      .expect((res) => {
        expect(res.body.message).toBe(`No auth token`);
      });
  });

  it('Find all day off of user success', async () => {
    const createDaysOf = await request(app.getHttpServer())
      .post('/days-off')
      .set('Authorization', 'Bearer ' + loginUser.body.data.access_token)
      .send(INIT_DAYOFF)
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        expect(res.body.message).toBe('Create day off success');
      });
    const findDaysOff = await request(app.getHttpServer())
      .get(`/days-off/user/${createUser.body.data.id}`)
      .query({
        page: '1',
        limit: '10',
        from: '2022-01-01',
        to: '2022-12-31',
        name: '',
      })
      .set('Authorization', 'Bearer ' + loginUser.body.data.access_token)
      .expect(HttpStatus.OK);
  });
  it('Find all day off of not exist user', async () => {
    const fakeUser = -1;
    const findDaysOff = await request(app.getHttpServer())
      .get(`/days-off/user/${fakeUser}`)
      .set('Authorization', 'Bearer ' + loginUser.body.data.access_token)
      .expect(HttpStatus.INTERNAL_SERVER_ERROR)
      .expect((res) => {
        expect(res.body.message).toBe(`User id = ${fakeUser} not exist`);
      });
  });

  it('Delete day off success', async () => {
    const createDaysOf = await request(app.getHttpServer())
      .post('/days-off')
      .set('Authorization', 'Bearer ' + loginUser.body.data.access_token)
      .send(INIT_DAYOFF)
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        expect(res.body.message).toBe('Create day off success');
      });
    const deleteDayOff = await request(app.getHttpServer())
      .delete(`/days-off/${createDaysOf.body.data.id}`)
      .set('Authorization', 'Bearer ' + loginUser.body.data.access_token)
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.message).toBe(
          `Delete day off id = ${createDaysOf.body.data.id} success`,
        );
      });
  });

  it('Delete day off id not exist', async () => {
    const fakeId = -1;
    const createDaysOf = await request(app.getHttpServer())
      .post('/days-off')
      .set('Authorization', 'Bearer ' + loginUser.body.data.access_token)
      .send(INIT_DAYOFF)
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        expect(res.body.message).toBe('Create day off success');
      });
    const deleteDayOff = await request(app.getHttpServer())
      .delete(`/days-off/${fakeId}`)
      .set('Authorization', 'Bearer ' + loginUser.body.data.access_token)
      .expect(HttpStatus.INTERNAL_SERVER_ERROR)
      .expect((res) => {
        expect(res.body.message).toBe(`Day off id = ${fakeId} not exist`);
      });
  });
});
