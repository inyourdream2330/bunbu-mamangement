import { Controller } from '@nestjs/common';
import { CompensationsService } from './compensations.service';

@Controller('compensations')
export class CompensationsController {
  constructor(private readonly compensationsService: CompensationsService) {}
}
