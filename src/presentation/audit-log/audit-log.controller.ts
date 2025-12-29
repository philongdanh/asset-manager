import {
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Query,
} from '@nestjs/common';
import {
    GetAuditLogDetailsQuery,
    GetAuditLogsQuery,
} from 'src/application/queries';
import {
    GetAuditLogDetailsHandler,
    GetAuditLogsHandler,
} from 'src/application/queries/handlers';
import { Permissions } from 'src/modules/auth/presentation';
import {
    AuditLogResponse,
    GetAuditLogsRequest,
} from './dto';
import { AuditLog } from 'src/domain/inventory-audit/audit-log';

@Controller('audit-logs')
export class AuditLogController {
    constructor(
        private readonly getListHandler: GetAuditLogsHandler,
        private readonly getDetailsHandler: GetAuditLogDetailsHandler,
    ) { }

    @Permissions('AUDIT_VIEW')
    @Get()
    async getList(
        @Query() query: GetAuditLogsRequest,
        @Query('organizationId') organizationId: string,
    ): Promise<{ data: AuditLogResponse[]; total: number }> {
        const q: GetAuditLogsQuery = {
            organizationId: organizationId || '',
            options: {
                userId: query.userId,
                action: query.action,
                entityType: query.entityType,
                startDate: query.startDate ? new Date(query.startDate) : undefined,
                endDate: query.endDate ? new Date(query.endDate) : undefined,
                limit: query.limit,
                offset: query.offset,
            },
        };

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
        return {
            id: entity.id,
            organization_id: entity.organizationId,
            user_id: entity.userId,
            action: entity.action,
            entity_type: entity.entityType,
            entity_id: entity.entityId,
            old_value: entity.oldValue,
            new_value: entity.newValue,
            action_time: entity.actionTime,
            ip_address: entity.ipAddress,
        };
    }
}
