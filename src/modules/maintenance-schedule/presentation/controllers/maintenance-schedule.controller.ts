import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Delete,
} from '@nestjs/common';
import {
  CreateMaintenanceScheduleCommand,
  StartMaintenanceCommand,
  CompleteMaintenanceCommand,
  CancelMaintenanceCommand,
  DeleteMaintenanceScheduleCommand,
  CreateMaintenanceScheduleHandler,
  StartMaintenanceHandler,
  CompleteMaintenanceHandler,
  CancelMaintenanceHandler,
  DeleteMaintenanceScheduleHandler,
  GetMaintenanceSchedulesQuery,
  GetMaintenanceScheduleDetailsQuery,
  GetMaintenanceSchedulesHandler,
  GetMaintenanceScheduleDetailsHandler,
} from '../../application';
import { MaintenanceScheduleResult } from '../../application/dtos/maintenance-schedule.result';
import { CurrentUser, Permissions } from 'src/modules/auth/presentation';
import type { JwtPayload } from '../../../auth/presentation/interfaces/jwt-payload.interface';
import { MaintenanceSchedule } from '../../domain';
import {
  MaintenanceScheduleResponse,
  CreateMaintenanceScheduleRequest,
  CompleteMaintenanceRequest,
  CancelMaintenanceRequest,
  GetMaintenanceSchedulesRequest,
} from '../dto';

@Controller('maintenance-schedules')
export class MaintenanceScheduleController {
  constructor(
    private readonly createHandler: CreateMaintenanceScheduleHandler,
    private readonly startHandler: StartMaintenanceHandler,
    private readonly completeHandler: CompleteMaintenanceHandler,
    private readonly cancelHandler: CancelMaintenanceHandler,
    private readonly deleteHandler: DeleteMaintenanceScheduleHandler,
    private readonly getListHandler: GetMaintenanceSchedulesHandler,
    private readonly getDetailsHandler: GetMaintenanceScheduleDetailsHandler,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Permissions('MAINTENANCE_CREATE')
  @Post()
  async create(
    @Body() dto: CreateMaintenanceScheduleRequest,
  ): Promise<MaintenanceScheduleResponse> {
    const cmd = new CreateMaintenanceScheduleCommand(
      dto.assetId,
      dto.organizationId,
      dto.maintenanceType,
      dto.scheduledDate,
      dto.description || null,
      dto.estimatedCost || null,
    );
    const result = await this.createHandler.execute(cmd);
    return this.toResponse({
      maintenance: result,
      asset: null,
      organization: null,
      performedByUser: null,
    });
  }

  @Permissions('MAINTENANCE_UPDATE')
  @Patch(':id/start')
  async start(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<MaintenanceScheduleResponse> {
    const performerId = user.id;
    const cmd = new StartMaintenanceCommand(id, performerId);
    const result = await this.startHandler.execute(cmd);
    return this.toResponse({
      maintenance: result,
      asset: null,
      organization: null,
      performedByUser: null,
    });
  }

  @Permissions('MAINTENANCE_UPDATE')
  @Patch(':id/complete')
  async complete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: CompleteMaintenanceRequest,
  ): Promise<MaintenanceScheduleResponse> {
    const cmd = new CompleteMaintenanceCommand(
      id,
      dto.result,
      dto.actualCost || null,
    );
    const result = await this.completeHandler.execute(cmd);
    return this.toResponse({
      maintenance: result,
      asset: null,
      organization: null,
      performedByUser: null,
    });
  }

  @Permissions('MAINTENANCE_UPDATE')
  @Patch(':id/cancel')
  async cancel(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: CancelMaintenanceRequest,
  ): Promise<MaintenanceScheduleResponse> {
    const cmd = new CancelMaintenanceCommand(id, dto.reason);
    const result = await this.cancelHandler.execute(cmd);
    return this.toResponse({
      maintenance: result,
      asset: null,
      organization: null,
      performedByUser: null,
    });
  }

  @Permissions('MAINTENANCE_VIEW')
  @Get()
  async getList(
    @Query() query: GetMaintenanceSchedulesRequest,
    @Query('organizationId') organizationId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<{ data: MaintenanceScheduleResponse[]; total: number }> {
    const orgId = user.isRoot
      ? organizationId || ''
      : user.organizationId || '';

    const q = new GetMaintenanceSchedulesQuery(orgId, {
      assetId: query.assetId,
      status: query.status,
      maintenanceType: query.maintenanceType,
      startDate: query.startDate,
      endDate: query.endDate,
      limit: query.limit,
      offset: query.offset,
    });

    const result = await this.getListHandler.execute(q);
    return {
      data: result.data.map((item) => this.toResponse(item)),
      total: result.total,
    };
  }

  @Permissions('MAINTENANCE_VIEW')
  @Get(':id')
  async getDetails(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<MaintenanceScheduleResponse> {
    const query = new GetMaintenanceScheduleDetailsQuery(id);
    const result = await this.getDetailsHandler.execute(query);
    return this.toResponse(result);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('MAINTENANCE_DELETE')
  @Delete(':id')
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.deleteHandler.execute(new DeleteMaintenanceScheduleCommand(id));
  }

  private toResponse(
    result: MaintenanceScheduleResult,
  ): MaintenanceScheduleResponse {
    return new MaintenanceScheduleResponse(result);
  }
}
