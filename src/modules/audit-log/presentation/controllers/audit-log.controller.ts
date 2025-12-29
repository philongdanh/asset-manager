import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import {
  GetAuditLogDetailsQuery,
  GetAuditLogsQuery,
} from '../../application/queries';
import {
  GetAuditLogDetailsHandler,
  GetAuditLogsHandler,
} from '../../application/queries';
import { Permissions } from 'src/modules/auth/presentation';
import { AuditLogResponse, GetAuditLogsRequest } from '../dto';
import { AuditLog, AuditAction, EntityType } from '../../domain';
import { plainToInstance } from 'class-transformer';

@Controller('audit-logs')
export class AuditLogController {
  constructor(
    private readonly getListHandler: GetAuditLogsHandler,
    private readonly getDetailsHandler: GetAuditLogDetailsHandler,
  ) {}

  @Permissions('AUDIT_VIEW')
  @Get()
  async getList(
    @Query() query: GetAuditLogsRequest,
    @Query('organizationId') organizationId: string,
  ): Promise<{ data: AuditLogResponse[]; total: number }> {
    const q = new GetAuditLogsQuery(organizationId || '', {
      userId: query.userId,
      action: query.action as AuditAction,
      entityType: query.entityType as EntityType,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      limit: query.limit,
      offset: query.offset,
    });

    const result = await this.getListHandler.execute(q);
    return {
      data: result.data.map((item) => this.toResponse(item)),
      total: result.total,
    };
  }

  @Permissions('AUDIT_VIEW')
  @Get(':id')
  async getDetails(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<AuditLogResponse> {
    const query = new GetAuditLogDetailsQuery(id);
    const result = await this.getDetailsHandler.execute(query);
    return this.toResponse(result);
  }

  private toResponse(entity: AuditLog): AuditLogResponse {
    return plainToInstance(AuditLogResponse, entity, {
      excludeExtraneousValues: true,
    });
  }
}
