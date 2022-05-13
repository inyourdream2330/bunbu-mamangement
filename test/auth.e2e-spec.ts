import { HttpStatus, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import moment from 'moment';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { clearDB } from '../src/auth/ultis/DB.service';
import { TokenService } from '../src/auth/ultis/token.service';
import {
  ADMIN_JWT_PAYLOAD,
  INIT_USER_STAFF,
  REGEX_JWT,
} from '../src/constant/constant';

describe('AuthController E2E Test', () => {
  let app: INestApplication;
  let tokenService: TokenService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    tokenService = moduleFixture.get<TokenService>(TokenService);
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await clearDB(['user']);
    await app.init();
  });

  afterAll(async () => {
    await clearDB(['user']);
  });

  it('Login Logout RefreshToken', async () => {
    const loginBody = {
      email: INIT_USER_STAFF.email,
      password: '1',
      remember: false,
    };
    // Add user before login
    const accessToken = await tokenService.createAccessToken(ADMIN_JWT_PAYLOAD);
    await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(INIT_USER_STAFF);
    // Login fail : email not exist
    const loginFailEmail = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginBody, email: 'super-fail-email@gmail.com' })
      .expect(HttpStatus.UNAUTHORIZED)
      .expect((res) => {
        expect(res.body.message).toBe('User not exist');
      });
    // Login fail : password not match
    const loginFailPassword = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginBody, password: 'super-fail-password' })
      .expect(HttpStatus.UNAUTHORIZED)
      .expect((res) => {
        expect(res.body.message).toBe('Password incorrect');
      });

    // Login success
    const loginNotRemember = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginBody)
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.message).toBe('Login Success');
      });

    // JWT format
    expect(REGEX_JWT.test(loginNotRemember.body.data.access_token)).toBe(true);
    expect(REGEX_JWT.test(loginNotRemember.body.data.refresh_token)).toBe(true);
    // JWT Expire date Access Token
    expect(
      jwtService.decode(loginNotRemember.body.data.access_token)['exp'] -
        jwtService.decode(loginNotRemember.body.data.access_token)['iat'] ===
        60 * 60 * 24,
    ).toBe(true);
    // JWT Exprire date Refresh Token (Not remember)  = 1 day
    expect(
      jwtService.decode(loginNotRemember.body.data.refresh_token)['exp'] -
        jwtService.decode(loginNotRemember.body.data.refresh_token)['iat'] ===
        60 * 60 * 24,
    ).toBe(true);
    // JWT Exprire date Refresh Token (Remember) = 30 day
    const loginRemember = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginBody, remember: true })
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.message).toBe('Login Success');
      });
    expect(
      jwtService.decode(loginRemember.body.data.refresh_token)['exp'] -
        jwtService.decode(loginRemember.body.data.refresh_token)['iat'] ===
        60 * 60 * 24 * 30,
    ).toBe(true);

    // Refresh Token
  });
});
