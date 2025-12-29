import { Module } from '@nestjs/common';
import { CreateAccountingEntryHandler } from 'src/application/commands/handlers';
import {
  GetAccountingEntryDetailsHandler,
  GetAccountingEntriesHandler,
} from 'src/application/queries/handlers';
import { ACCOUNTING_ENTRY_REPOSITORY } from 'src/domain/finance-accounting/accounting-entry';
import { ID_GENERATOR } from 'src/domain/core/interfaces';
import { UuidGeneratorService } from 'src/infrastructure/common/id-generator';
import { PrismaService } from 'src/infrastructure/persistence/prisma';
import { PrismaAccountingEntryRepository } from 'src/infrastructure/persistence/prisma/repositories';
import { AccountingEntryController } from './accounting-entry.controller';

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
    CreateAccountingEntryHandler,
    GetAccountingEntriesHandler,
    GetAccountingEntryDetailsHandler,
  ],
})
export class AccountingEntryModule {}
