import { Module } from '@nestjs/common';
import {
    GetAuditLogDetailsHandler,
    GetAuditLogsHandler,
    CreateAuditLogHandler,
} from './application';
import { AUDIT_LOG_REPOSITORY } from './domain';
import { ID_GENERATOR } from 'src/domain/core/interfaces';
import { UuidGeneratorService } from 'src/infrastructure/common/id-generator';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
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
export class AuditLogModule { }
