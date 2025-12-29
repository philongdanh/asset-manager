import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  AUDIT_LOG_REPOSITORY,
  type IAuditLogRepository,
  AuditLog,
} from 'src/domain/inventory-audit/audit-log';
import { GetAuditLogDetailsQuery } from '../get-audit-log-details.query';

@Injectable()
export class GetAuditLogDetailsHandler {
  constructor(
    @Inject(AUDIT_LOG_REPOSITORY)
    private readonly repository: IAuditLogRepository,
  ) {}

  async execute(query: GetAuditLogDetailsQuery): Promise<AuditLog> {
    const log = await this.repository.findById(query.id);
    if (!log) {
      throw new UseCaseException(
        'Audit log not found',
        'GetAuditLogDetailsQuery',
      );
    }
    return log;
  }
}
