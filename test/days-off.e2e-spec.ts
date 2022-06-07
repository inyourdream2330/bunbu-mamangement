import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { create } from 'domain';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { clearDB } from '../src/auth/ultis/DB.service';
import { TokenService } from '../src/auth/ultis/token.service';
import {
  ADMIN_JWT_PAYLOAD,
  INIT_DAYOFF,
  INIT_USER_STAFF,
  STAFF_JWT_PAYLOAD,
} from '../src/constant/constant';
import {
  DAYOFF_SAMPLE_TEST_DATA,
  DAYOFF_SAMPLE_TEST_RESULT_CASE_1,
  DAYOFF_SAMPLE_TEST_RESULT_CASE_2,
  DAYOFF_SAMPLE_TEST_RESULT_CASE_3,
  DAYOFF_SAMPLE_TEST_RESULT_CASE_4,
  DAYOFF_SAMPLE_TEST_RESULT_CASE_5,
  DAYOFF_SAMPLE_TEST_RESULT_CASE_6,
  DAYOFF_SAMPLE_TEST_RESULT_CASE_7,
} from '../src/constant/sampleTestData';
import { DaysOffService } from '../src/day-off/days-off.service';
import { UsersService } from '../src/users/users.service';
import { format, subDays, addDays } from 'date-fns';

describe('Days Off Controller E2E Test', () => {
  let app: INestApplication;
  let tokenService: TokenService;
  let usersService: UsersService;
  let authController: AuthController;
  let authService: AuthService;
  let daysOffService: DaysOffService;
  let createUser;
  let loginUserAccessToken;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    tokenService = moduleFixture.get<TokenService>(TokenService);
    usersService = moduleFixture.get<UsersService>(UsersService);
    authController = moduleFixture.get<AuthController>(AuthController);
    authService = moduleFixture.get<AuthService>(AuthService);
    daysOffService = moduleFixture.get<DaysOffService>(DaysOffService);

    await clearDB(['day_off']);
    await clearDB(['user']);
    await app.init();
    createUser = await usersService.create(INIT_USER_STAFF);
    loginUserAccessToken = await tokenService.createAccessToken({
      ...STAFF_JWT_PAYLOAD,
      id: createUser.data.id,
    });
  });

  afterAll(async () => {
    await clearDB(['day_off']);
  });

  describe('Create day off', () => {
    it('Create day off success', async () => {
      return await request(app.getHttpServer())
        .post('/days-off')
        .set('Authorization', 'Bearer ' + loginUserAccessToken)
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
    it('Create day off missing date', async () => {
      return await request(app.getHttpServer())
        .post('/days-off')
        .set('Authorization', 'Bearer ' + loginUserAccessToken)
        .send({ ...INIT_DAYOFF, date: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('date should not be empty');
        });
    });

    it('Create day off missing reasons', async () => {
      return await request(app.getHttpServer())
        .post('/days-off')
        .set('Authorization', 'Bearer ' + loginUserAccessToken)
        .send({ ...INIT_DAYOFF, reasons: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('reasons should not be empty');
        });
    });
    it('Create day off missing type', async () => {
      return await request(app.getHttpServer())
        .post('/days-off')
        .set('Authorization', 'Bearer ' + loginUserAccessToken)
        .send({ ...INIT_DAYOFF, type: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('type should not be empty');
        });
    });
  });
  describe('Find days off', () => {
    beforeEach(async () => {
      await daysOffService.importDataForTest(createUser.data.id);
    });

    it('Find day off case 1, get default', async () => {
      jest.setTimeout(30000);
      await request(app.getHttpServer())
        .get('/days-off')
        .set('Authorization', 'Bearer ' + loginUserAccessToken)
        .expect(HttpStatus.OK)
        .expect(async (res) => {
          expect(res.body.message).toBe('Find days off success');
          expect(res.body.data).toMatchObject(DAYOFF_SAMPLE_TEST_RESULT_CASE_1);
        });
    });
    it('Find day off case 2, sort_by id asc', async () => {
      jest.setTimeout(30000);
      await request(app.getHttpServer())
        .get('/days-off')
        .set('Authorization', 'Bearer ' + loginUserAccessToken)
        .query({ sort_by: 'id', sort: 'asc' })
        .expect(HttpStatus.OK)
        .expect(async (res) => {
          expect(res.body.message).toBe('Find days off success');
          expect(res.body.data).toMatchObject(DAYOFF_SAMPLE_TEST_RESULT_CASE_2);
        });
    });
    it('Find day off case 3, sort_by date desc', async () => {
      jest.setTimeout(30000);
      await request(app.getHttpServer())
        .get('/days-off')
        .set('Authorization', 'Bearer ' + loginUserAccessToken)
        .query({ sort_by: 'date', sort: 'desc' })
        .expect(HttpStatus.OK)
        .expect(async (res) => {
          expect(res.body.message).toBe('Find days off success');
          expect(res.body.data).toMatchObject(DAYOFF_SAMPLE_TEST_RESULT_CASE_3);
        });
    });
    it('Find day off case 4, sort_by default, from cover all', async () => {
      jest.setTimeout(30000);
      await request(app.getHttpServer())
        .get('/days-off')
        .set('Authorization', 'Bearer ' + loginUserAccessToken)
        .query({
          from: format(subDays(new Date(), 1000), 'yyyy-MM-dd'),
        })
        .expect(HttpStatus.OK)
        .expect(async (res) => {
          expect(res.body.message).toBe('Find days off success');
          expect(res.body.data).toMatchObject(DAYOFF_SAMPLE_TEST_RESULT_CASE_4);
        });
    });

    it('Find day off case 5, sort_by default, to cover all', async () => {
      jest.setTimeout(30000);
      await request(app.getHttpServer())
        .get('/days-off')
        .set('Authorization', 'Bearer ' + loginUserAccessToken)
        .query({
          to: format(addDays(new Date(), 1000), 'yyyy-MM-dd'),
        })
        .expect(HttpStatus.OK)
        .expect(async (res) => {
          expect(res.body.message).toBe('Find days off success');
          expect(res.body.data).toMatchObject(DAYOFF_SAMPLE_TEST_RESULT_CASE_5);
        });
    });

    it('Find day off case 6, sort_by default, from - to cover all', async () => {
      jest.setTimeout(30000);
      await request(app.getHttpServer())
        .get('/days-off')
        .set('Authorization', 'Bearer ' + loginUserAccessToken)
        .query({
          to: format(addDays(new Date(), 1000), 'yyyy-MM-dd'),
          from: format(subDays(new Date(), 1000), 'yyyy-MM-dd'),
        })
        .expect(HttpStatus.OK)
        .expect(async (res) => {
          expect(res.body.message).toBe('Find days off success');
          expect(res.body.data).toMatchObject(DAYOFF_SAMPLE_TEST_RESULT_CASE_6);
        });
    });

    it('Find day off case 7, sort_by default, from - to cover all, limit 2, page 2', async () => {
      jest.setTimeout(30000);
      await request(app.getHttpServer())
        .get('/days-off')
        .set('Authorization', 'Bearer ' + loginUserAccessToken)
        .query({
          to: format(addDays(new Date(), 1000), 'yyyy-MM-dd'),
          from: format(subDays(new Date(), 1000), 'yyyy-MM-dd'),
          limit: 2,
          page: 2,
        })
        .expect(HttpStatus.OK)
        .expect(async (res) => {
          expect(res.body.message).toBe('Find days off success');
          expect(res.body.data).toMatchObject(DAYOFF_SAMPLE_TEST_RESULT_CASE_7);
        });
    });

    it('find day off missing auth token', async () => {
      return await request(app.getHttpServer())
        .get('/days-off')
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((res) => {
          expect(res.body.message).toBe('No auth token');
        });
    });
  });
  describe('Updatte day off', () => {
    let createDaysOff;
    beforeEach(async () => {
      createDaysOff = await daysOffService.createDayOff(
        INIT_DAYOFF,
        createUser.data.id,
      );
    });

    it('Update day off success', async () => {
      return await request(app.getHttpServer())
        .put(`/days-off/${createDaysOff.data.id}`)
        .set('Authorization', 'Bearer ' + loginUserAccessToken)
        .send({ ...INIT_DAYOFF, reasons: 'Reasons updated' })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.message).toBe(
            `Update day off id = ${createDaysOff.data.id} success`,
          );
        });
    });

    it('Update day off without token', async () => {
      await request(app.getHttpServer())
        .put(`/days-off/${createDaysOff.data.id}`)
        .send({ ...INIT_DAYOFF, reasons: 'Reasons updated' })
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((res) => {
          expect(res.body.message).toBe('No auth token');
        });
    });

    it('Update day off missing date', async () => {
      return await request(app.getHttpServer())
        .put(`/days-off/${createDaysOff.data.id}`)
        .set('Authorization', 'Bearer ' + loginUserAccessToken)
        .send({ ...INIT_DAYOFF, date: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('date should not be empty');
        });
    });

    it('Update day off missing reasons', async () => {
      return await request(app.getHttpServer())
        .put(`/days-off/${createDaysOff.data.id}`)
        .set('Authorization', 'Bearer ' + loginUserAccessToken)
        .send({ ...INIT_DAYOFF, reasons: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('reasons should not be empty');
        });
    });
    it('Update day off missing type', async () => {
      return await request(app.getHttpServer())
        .put(`/days-off/${createDaysOff.data.id}`)
        .set('Authorization', 'Bearer ' + loginUserAccessToken)
        .send({ ...INIT_DAYOFF, type: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('type should not be empty');
        });
    });
  });
});
