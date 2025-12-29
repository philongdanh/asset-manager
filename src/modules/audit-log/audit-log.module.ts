import { Module } from '@nestjs/common';
import {
  GetAuditLogDetailsHandler,
  GetAuditLogsHandler,
  CreateAuditLogHandler,
} from './application';
import { AUDIT_LOG_REPOSITORY } from './domain';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { UuidGeneratorService } from 'src/shared/infrastructure/id-generator';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';
import { PrismaAuditLogRepository } from './infrastructure';
import { AuditLogController } from './presentation';

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
  exports: [AUDIT_LOG_REPOSITORY, CreateAuditLogHandler],
})
export class AuditLogModule {}
