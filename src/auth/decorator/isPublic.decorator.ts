import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from 'src/constant/StatusConstant.constant';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
