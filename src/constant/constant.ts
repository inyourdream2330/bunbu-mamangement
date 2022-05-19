import { JwtPayload } from 'src/auth/types';

export const enum USER_STATUS {
  DELETED = 0,
  ACTIVE = 1,
  DEACTIVATIED = 2,
}

export const enum DAYOFF_STATUS {
  CONFIRMED = 0,
  WAITING = 1,
  REJECTED = 2,
}

export const enum OT_STATUS {
  CONFIRMED = 0,
  WAITING = 1,
  REJECTED = 2,
}

export const enum ROLE {
  ADMIN = 1,
  STAFF = 2,
}

export const enum DAYOFF {
  HALF_DAY_OFF = 0,
  FULL_DAY_OFF = 1,
}

export const enum CONTRACT_TYPE {
  PART_TIME = 0,
  FULL_TIME = 1,
}

export const IS_PUBLIC_KEY = 'isPublic';

export const INIT_USER_ADMIN = {
  name: 'admin',
  email: 'admin@gmail.com',
  gender: 1,
  id_card: 'id_card',
  address: 'Hà Nội',
  joining_date: '2021-11-11',
  dob: '2021-11-11',
  status: 1,
  phone: '12345678',
  contract_type: 1,
  official_date: '2021-11-11',
  role: 1,
  position: 1,
};

export const INIT_USER_STAFF = {
  name: 'staff',
  email: 'staff@gmail.com',
  gender: 1,
  id_card: 'id_card',
  address: 'Hà Nội',
  joining_date: '2021-11-11',
  dob: '2021-11-11',
  status: 1,
  phone: '12345678',
  contract_type: 1,
  official_date: '2021-11-11',
  role: 2,
  position: 1,
};
export const ADMIN_JWT_PAYLOAD: JwtPayload = {
  id: 0,
  email: 'admin@gmail.com',
  role: 1,
  remember: false,
};
export const STAFF_JWT_PAYLOAD: JwtPayload = {
  id: 1,
  email: 'staff@gmail.com',
  role: 2,
  remember: false,
};

export const REGEX_JWT: RegExp =
  /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

export const ACCESS_TOKEN_EXPIRES_IN = '1d';
export const REFRESH_TOKEN_EXPIRES_IN_DEFAULT = '1d';
export const REFRESH_TOKEN_EXPIRES_IN_REMEMBER = '30d';

export const LOGIN_BODY_ADMIN = {
  email: INIT_USER_ADMIN.email,
  password: '1',
  remember: false,
};

export const INIT_DAYOFF = {
  date: '2022-05-11',
  reasons: 'Đau pụng ẻ',
  status: 1,
  day_off_type: 1,
};
