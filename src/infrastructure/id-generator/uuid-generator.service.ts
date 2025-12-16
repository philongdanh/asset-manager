// uuid-generator.service.ts
import { Injectable } from '@nestjs/common';
import { randomUUID as uuidv4 } from 'crypto';
import { IIdGenerator } from 'src/shared/domain/interfaces/id-generator.interface';

@Injectable()
export class UuidGeneratorService implements IIdGenerator {
  generate(): string {
    return uuidv4();
  }
}
