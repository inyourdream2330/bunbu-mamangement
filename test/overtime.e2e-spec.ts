import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { clearDB } from '../src/auth/ultis/DB.service';
import { TokenService } from '../src/auth/ultis/token.service';
import { INIT_OVERTIME, INIT_USER_STAFF } from '../src/constant/constant';
import { OvertimesService } from '../src/overtimes/overtimes.service';
import { UsersService } from '../src/users/users.service';

describe('Days Off Controller E2E Test', () => {
  let app: INestApplication;
  let tokenService: TokenService;
  let overtimesService: OvertimesService;
  let usersService: UsersService;
  let authService: AuthService;

  let accessToken;
  let createUser;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    tokenService = moduleFixture.get<TokenService>(TokenService);
    overtimesService = moduleFixture.get<OvertimesService>(OvertimesService);
    usersService = moduleFixture.get<UsersService>(UsersService);
    authService = moduleFixture.get<AuthService>(AuthService);
    await clearDB(['overtimes', 'user']);
    await app.init();

    createUser = await usersService.create(INIT_USER_STAFF);
    accessToken = await tokenService.createAccessToken(createUser);
  });

  afterAll(async () => {
    await clearDB(['overtimes', 'user']);
  });
  beforeAll(async () => {});

  describe('Create compensation', () => {
    it('Create compensation success', async () => {
      return await request(app.getHttpServer())
        .post(`/overtimes`)
        .set('Authorization', 'Bearer ' + accessToken)
        .send(INIT_OVERTIME)
        .expect(HttpStatus.CREATED);
    });

    it('Create compensation fail without token', async () => {
      return await request(app.getHttpServer())
        .post(`/overtimes`)
        //   .set('Authorization', 'Bearer ' + accessToken)
        .send(INIT_OVERTIME)
        .expect(HttpStatus.UNAUTHORIZED);
    });
    it('Create compensation with missing date', async () => {
      return await request(app.getHttpServer())
        .post(`/overtimes`)
        .set('Authorization', 'Bearer ' + accessToken)
        .send({ ...INIT_OVERTIME, date: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('date should not be empty');
        });
    });
    it('Create compensation with missing for_date', async () => {
      return await request(app.getHttpServer())
        .post(`/overtimes`)
        .set('Authorization', 'Bearer ' + accessToken)
        .send({ ...INIT_OVERTIME, for_date: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('for_date should not be empty');
        });
    });
    it('Create compensation with missing start_at', async () => {
      return await request(app.getHttpServer())
        .post(`/overtimes`)
        .set('Authorization', 'Bearer ' + accessToken)
        .send({ ...INIT_OVERTIME, start_at: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('start_at should not be empty');
        });
    });
    it('Create compensation with missing end_at', async () => {
      return await request(app.getHttpServer())
        .post(`/overtimes`)
        .set('Authorization', 'Bearer ' + accessToken)
        .send({ ...INIT_OVERTIME, end_at: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('end_at should not be empty');
        });
    });
  });
});
