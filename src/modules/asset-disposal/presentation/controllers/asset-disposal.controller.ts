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
} from '@nestjs/common';
import {
  ApproveAssetDisposalCommand,
  CancelAssetDisposalCommand,
  CreateAssetDisposalCommand,
  RejectAssetDisposalCommand,
  ApproveAssetDisposalHandler,
  CancelAssetDisposalHandler,
  CreateAssetDisposalHandler,
  RejectAssetDisposalHandler,
  GetAssetDisposalDetailsQuery,
  GetAssetDisposalsQuery,
  GetAssetDisposalDetailsHandler,
  GetAssetDisposalsHandler,
} from '../../application';
import { AssetDisposalResult } from '../../application/dtos/asset-disposal.result';
import { CurrentUser, Permissions } from 'src/modules/auth/presentation';
import type { JwtPayload } from '../../../auth/presentation/interfaces/jwt-payload.interface';
import { AssetDisposal } from '../../domain';
import {
  AssetDisposalResponse,
  CreateAssetDisposalRequest,
  GetAssetDisposalsRequest,
  RejectAssetDisposalRequest,
} from '../dto';

@Controller('asset-disposals')
export class AssetDisposalController {
  constructor(
    private readonly createHandler: CreateAssetDisposalHandler,
    private readonly approveHandler: ApproveAssetDisposalHandler,
    private readonly rejectHandler: RejectAssetDisposalHandler,
    private readonly cancelHandler: CancelAssetDisposalHandler,
    private readonly getListHandler: GetAssetDisposalsHandler,
    private readonly getDetailsHandler: GetAssetDisposalDetailsHandler,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Permissions('DISPOSAL_CREATE')
  @Post()
  async create(
    @Body() dto: CreateAssetDisposalRequest,
  ): Promise<AssetDisposalResponse> {
    const cmd = new CreateAssetDisposalCommand(
      dto.assetId,
      dto.organizationId,
      dto.disposalType,
      dto.disposalDate,
      dto.disposalValue,
      dto.reason || null,
    );
    const result = await this.createHandler.execute(cmd);
    return this.toResponse({
      disposal: result,
      asset: null,
      organization: null,
      approvedByUser: null,
    });
  }

  @Permissions('DISPOSAL_APPROVE')
  @Patch(':id/approve')
  async approve(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<AssetDisposalResponse> {
    const approverId = user.id;
    const cmd = new ApproveAssetDisposalCommand(id, approverId);
    const result = await this.approveHandler.execute(cmd);
    return this.toResponse({
      disposal: result,
      asset: null,
      organization: null,
      approvedByUser: null,
    });
  }

  @Permissions('DISPOSAL_APPROVE')
  @Patch(':id/reject')
  async reject(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: RejectAssetDisposalRequest,
    @CurrentUser() user: JwtPayload,
  ): Promise<AssetDisposalResponse> {
    const rejectorId = user.id;
    const cmd = new RejectAssetDisposalCommand(id, rejectorId, dto.reason);
    const result = await this.rejectHandler.execute(cmd);
    return this.toResponse({
      disposal: result,
      asset: null,
      organization: null,
      approvedByUser: null,
    });
  }

  @Permissions('DISPOSAL_UPDATE')
  @Patch(':id/cancel')
  async cancel(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<AssetDisposalResponse> {
    const cmd = new CancelAssetDisposalCommand(id);
    const result = await this.cancelHandler.execute(cmd);
    return this.toResponse({
      disposal: result,
      asset: null,
      organization: null,
      approvedByUser: null,
    });
  }

  @Permissions('DISPOSAL_VIEW')
  @Get()
  async getList(
    @Query() query: GetAssetDisposalsRequest,
    @Query('organizationId') organizationId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<{ data: AssetDisposalResponse[]; total: number }> {
    const orgId = user.isRoot
      ? organizationId || ''
      : user.organizationId || '';

    const q: GetAssetDisposalsQuery = {
      organizationId: orgId,
      options: {
        status: query.status,
        disposalType: query.disposalType,
        startDate: query.startDate,
        endDate: query.endDate,
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

  @Permissions('DISPOSAL_VIEW')
  @Get(':id')
  async getDetails(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<AssetDisposalResponse> {
    const query = new GetAssetDisposalDetailsQuery(id);
    const result = await this.getDetailsHandler.execute(query);
    return this.toResponse(result);
  }

  private toResponse(result: AssetDisposalResult): AssetDisposalResponse {
    return new AssetDisposalResponse(result);
  }
}
