import { Injectable, Inject } from '@nestjs/common';
import {
  AUDIT_LOG_REPOSITORY,
  type IAuditLogRepository,
  AuditLog,
} from 'src/modules/audit-log/domain';
import { GetAuditLogsQuery } from './get-audit-logs.query';

@Injectable()
export class GetAuditLogsHandler {
  constructor(
    @Inject(AUDIT_LOG_REPOSITORY)
    private readonly repository: IAuditLogRepository,
  ) {}

  async execute(
    query: GetAuditLogsQuery,
  ): Promise<{ data: AuditLog[]; total: number }> {
    return await this.repository.findAll(query.organizationId, query.options);
  }
}
