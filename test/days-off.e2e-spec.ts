import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
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
import { DaysOffService } from '../src/day-off/days-off.service';
import { UsersService } from '../src/users/users.service';

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
  beforeAll(async () => {});

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

  describe('Create day off missing required field', () => {
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
    let createDaysOff;
    beforeEach(async () => {
      createDaysOff = await daysOffService.createDayOff(
        INIT_DAYOFF,
        createUser.data.id,
      );
    });

    it('find day off success', async () => {
      return await request(app.getHttpServer())
        .get('/days-off')
        .set('Authorization', 'Bearer ' + loginUserAccessToken)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.message).toContain('Find days off success');
        });
    });

    it('find day off missing auth token', async () => {
      return await request(app.getHttpServer())
        .get('/days-off')
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((res) => {
          expect(res.body.message).toContain('No auth token');
        });
    });
  });
});
