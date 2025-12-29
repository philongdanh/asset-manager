import { Module, Provider } from '@nestjs/common';
import { ACCOUNTING_ENTRY_REPOSITORY } from './domain';
import { PrismaAccountingEntryRepository } from './infrastructure';
import {
  CreateAccountingEntryHandler,
  GetAccountingEntriesHandler,
  GetAccountingEntryDetailsHandler,
} from './application';
import { AccountingEntryController } from './presentation';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { UuidGeneratorService } from 'src/shared/infrastructure/id-generator';

const handlers: Provider[] = [
  CreateAccountingEntryHandler,
  GetAccountingEntriesHandler,
  GetAccountingEntryDetailsHandler,
];

@Module({
  controllers: [AccountingEntryController],
  providers: [
    PrismaService,
    {
      provide: ID_GENERATOR,
      useClass: UuidGeneratorService,
    },
    {
      provide: ACCOUNTING_ENTRY_REPOSITORY,
      useClass: PrismaAccountingEntryRepository,
    },
    ...handlers,
  ],
  exports: [ACCOUNTING_ENTRY_REPOSITORY],
})
export class AccountingEntryModule {}
