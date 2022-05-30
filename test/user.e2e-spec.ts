import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { clearDB } from '../src/auth/ultis/DB.service';
import { TokenService } from '../src/auth/ultis/token.service';
import {
  ADMIN_JWT_PAYLOAD,
  INIT_USER_ADMIN,
  INIT_USER_STAFF,
  STAFF_JWT_PAYLOAD,
  UPDATE_USER_DATA,
} from '../src/constant/constant';
import { UsersService } from '../src/users/users.service';
import { AppModule } from './../src/app.module';

describe('UsersController E2E Test', () => {
  let app: INestApplication;
  let tokenService: TokenService;
  let usersService: UsersService;
  let accessTokenAdmin: string;
  let accessTokenStaff: string;
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
    usersService = moduleFixture.get<UsersService>(UsersService);

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
      .expect(HttpStatus.UNAUTHORIZED)
      .expect((res) => {
        expect(res.body.message).toBe('No auth token');
      });
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

  describe('Testing create user missing each required field', () => {
    it('Create user with missing name', async () => {
      await request(app.getHttpServer())
        .post(`/users`)
        .set('Authorization', 'Bearer ' + accessTokenAdmin)
        .send({ ...UPDATE_USER_DATA, name: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('name should not be empty');
        });
    });
    it('Create user with missing gender', async () => {
      await request(app.getHttpServer())
        .post(`/users`)
        .set('Authorization', 'Bearer ' + accessTokenAdmin)
        .send({ ...UPDATE_USER_DATA, gender: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('gender should not be empty');
        });
    });
    it('Create user with missing email', async () => {
      await request(app.getHttpServer())
        .post(`/users`)
        .set('Authorization', 'Bearer ' + accessTokenAdmin)
        .send({ ...UPDATE_USER_DATA, email: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('email should not be empty');
        });
    });
    it('Create user with missing id_card', async () => {
      await request(app.getHttpServer())
        .post(`/users`)
        .set('Authorization', 'Bearer ' + accessTokenAdmin)
        .send({ ...UPDATE_USER_DATA, id_card: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('id_card should not be empty');
        });
    });
    it('Create user with missing address', async () => {
      await request(app.getHttpServer())
        .post(`/users`)
        .set('Authorization', 'Bearer ' + accessTokenAdmin)
        .send({ ...UPDATE_USER_DATA, address: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('address should not be empty');
        });
    });
    it('Create user with missing joining_date', async () => {
      await request(app.getHttpServer())
        .post(`/users`)
        .set('Authorization', 'Bearer ' + accessTokenAdmin)
        .send({ ...UPDATE_USER_DATA, joining_date: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain(
            'joining_date should not be empty',
          );
        });
    });
    it('Create user with missing dob', async () => {
      await request(app.getHttpServer())
        .post(`/users`)
        .set('Authorization', 'Bearer ' + accessTokenAdmin)
        .send({ ...UPDATE_USER_DATA, dob: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('dob should not be empty');
        });
    });
    it('Create user with missing status', async () => {
      await request(app.getHttpServer())
        .post(`/users`)
        .set('Authorization', 'Bearer ' + accessTokenAdmin)
        .send({ ...UPDATE_USER_DATA, status: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('status should not be empty');
        });
    });
    it('Create user with missing phone', async () => {
      await request(app.getHttpServer())
        .post(`/users`)
        .set('Authorization', 'Bearer ' + accessTokenAdmin)
        .send({ ...UPDATE_USER_DATA, phone: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('phone should not be empty');
        });
    });
    it('Create user with missing contract_type', async () => {
      await request(app.getHttpServer())
        .post(`/users`)
        .set('Authorization', 'Bearer ' + accessTokenAdmin)
        .send({ ...UPDATE_USER_DATA, contract_type: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain(
            'contract_type should not be empty',
          );
        });
    });
    it('Create user with missing official_date', async () => {
      await request(app.getHttpServer())
        .post(`/users`)
        .set('Authorization', 'Bearer ' + accessTokenAdmin)
        .send({ ...UPDATE_USER_DATA, official_date: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain(
            'official_date should not be empty',
          );
        });
    });
    it('Create user with missing role', async () => {
      await request(app.getHttpServer())
        .post(`/users`)
        .set('Authorization', 'Bearer ' + accessTokenAdmin)
        .send({ ...UPDATE_USER_DATA, role: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('role should not be empty');
        });
    });

    it('Create user with missing position', async () => {
      await request(app.getHttpServer())
        .post(`/users`)
        .set('Authorization', 'Bearer ' + accessTokenAdmin)
        .send({ ...UPDATE_USER_DATA, position: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('position should not be empty');
        });
    });
  });

  it('Change password', async () => {
    const createUser = await usersService.create(INIT_USER_STAFF);

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
    const createUser = await usersService.create(INIT_USER_STAFF);

    return await request(app.getHttpServer())
      .put(`/users/${createUser.data.id}`)
      .set('Authorization', 'Bearer ' + accessTokenAdmin)
      .send(UPDATE_USER_DATA)
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.message).toBe(
          `Update user ${createUser.data.id} success`,
        );
      });
  });

  describe('Testing update user missing each required field', () => {
    let userId;
    beforeAll(async () => {
      userId = (await usersService.create(INIT_USER_STAFF)).data.id;
    });
    it('Update user with missing name', async () => {
      await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', 'Bearer ' + accessTokenAdmin)
        .send({ ...UPDATE_USER_DATA, name: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('name should not be empty');
        });
    });
    it('Update user with missing gender', async () => {
      await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', 'Bearer ' + accessTokenAdmin)
        .send({ ...UPDATE_USER_DATA, gender: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('gender should not be empty');
        });
    });
    it('Update user with missing email', async () => {
      await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', 'Bearer ' + accessTokenAdmin)
        .send({ ...UPDATE_USER_DATA, email: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('email should not be empty');
        });
    });
    it('Update user with missing id_card', async () => {
      await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', 'Bearer ' + accessTokenAdmin)
        .send({ ...UPDATE_USER_DATA, id_card: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('id_card should not be empty');
        });
    });
    it('Update user with missing address', async () => {
      await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', 'Bearer ' + accessTokenAdmin)
        .send({ ...UPDATE_USER_DATA, address: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('address should not be empty');
        });
    });
    it('Update user with missing joining_date', async () => {
      await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', 'Bearer ' + accessTokenAdmin)
        .send({ ...UPDATE_USER_DATA, joining_date: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain(
            'joining_date should not be empty',
          );
        });
    });
    it('Update user with missing dob', async () => {
      await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', 'Bearer ' + accessTokenAdmin)
        .send({ ...UPDATE_USER_DATA, dob: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('dob should not be empty');
        });
    });
    it('Update user with missing status', async () => {
      await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', 'Bearer ' + accessTokenAdmin)
        .send({ ...UPDATE_USER_DATA, status: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('status should not be empty');
        });
    });
    it('Update user with missing phone', async () => {
      await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', 'Bearer ' + accessTokenAdmin)
        .send({ ...UPDATE_USER_DATA, phone: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('phone should not be empty');
        });
    });
    it('Update user with missing contract_type', async () => {
      await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', 'Bearer ' + accessTokenAdmin)
        .send({ ...UPDATE_USER_DATA, contract_type: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain(
            'contract_type should not be empty',
          );
        });
    });
    it('Update user with missing official_date', async () => {
      await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', 'Bearer ' + accessTokenAdmin)
        .send({ ...UPDATE_USER_DATA, official_date: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain(
            'official_date should not be empty',
          );
        });
    });
    it('Update user with missing role', async () => {
      await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', 'Bearer ' + accessTokenAdmin)
        .send({ ...UPDATE_USER_DATA, role: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('role should not be empty');
        });
    });

    it('Update user with missing position', async () => {
      await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', 'Bearer ' + accessTokenAdmin)
        .send({ ...UPDATE_USER_DATA, position: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('position should not be empty');
        });
    });
  });

  it('Update user without permission', async () => {
    const createUser = await usersService.create(INIT_USER_STAFF);

    return await request(app.getHttpServer())
      .put(`/users/${createUser.data.id}`)
      .set('Authorization', 'Bearer ' + accessTokenStaff)
      .send(UPDATE_USER_DATA)
      .expect(HttpStatus.UNAUTHORIZED)
      .expect((res) => {
        expect(res.body.message).toBe('Permission denied');
      });
  });

  it('get users', async () => {
    const accessToken = await tokenService.createAccessToken(ADMIN_JWT_PAYLOAD);
    const getUsers = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', 'Bearer ' + accessToken)
      .query({
        page: '1',
        limit: '10',
        name: '',
        email: '',
        code: '',
        sort: 'ASC',
        sort_by: '',
      })
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.message).toBe('Find users success');
      });
  });
});
