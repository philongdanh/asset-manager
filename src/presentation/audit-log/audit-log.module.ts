import { Module } from '@nestjs/common';
import {
  GetAuditLogDetailsHandler,
  GetAuditLogsHandler,
} from 'src/application/queries/handlers';
import { CreateAuditLogHandler } from 'src/application/commands/handlers';
import { AUDIT_LOG_REPOSITORY } from 'src/domain/inventory-audit/audit-log';
import { ID_GENERATOR } from 'src/domain/core/interfaces';
import { UuidGeneratorService } from 'src/infrastructure/common/id-generator';
import { PrismaService } from 'src/infrastructure/persistence/prisma';
import { PrismaAuditLogRepository } from 'src/infrastructure/persistence/prisma/repositories';
import { AuditLogController } from './audit-log.controller';

@Module({
  controllers: [AuditLogController],
  providers: [
    PrismaService,
    {
      provide: ID_GENERATOR,
      useClass: UuidGeneratorService,
    },
    {
      provide: AUDIT_LOG_REPOSITORY,
      useClass: PrismaAuditLogRepository,
    },
    GetAuditLogsHandler,
    GetAuditLogDetailsHandler,
    CreateAuditLogHandler,
  ],
})
export class AuditLogModule {}
