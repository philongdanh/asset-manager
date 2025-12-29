import { Injectable, Inject } from '@nestjs/common';
import { ID_GENERATOR, type IIdGenerator } from 'src/domain/core/interfaces';
import {
  AUDIT_LOG_REPOSITORY,
  type IAuditLogRepository,
  AuditLog,
} from 'src/modules/audit-log/domain';
import { CreateAuditLogCommand } from './create-audit-log.command';

@Injectable()
export class CreateAuditLogHandler {
  constructor(
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
    @Inject(AUDIT_LOG_REPOSITORY)
    private readonly repository: IAuditLogRepository,
  ) {}

  async execute(cmd: CreateAuditLogCommand): Promise<AuditLog> {
    const id = this.idGenerator.generate();
    const builder = AuditLog.builder(
      id,
      cmd.organizationId,
      cmd.userId,
      cmd.action,
      cmd.entityType,
      cmd.entityId,
    );

    builder.withChanges(cmd.oldValue || null, cmd.newValue || null);
    builder.withIpAddress(cmd.ipAddress || null);

    const log = builder.build();
    return await this.repository.save(log);
  }
}
