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
  ApproveAssetTransferCommand,
  CancelAssetTransferCommand,
  CompleteAssetTransferCommand,
  CreateAssetTransferCommand,
  RejectAssetTransferCommand,
  ApproveAssetTransferHandler,
  CancelAssetTransferHandler,
  CompleteAssetTransferHandler,
  CreateAssetTransferHandler,
  RejectAssetTransferHandler,
  GetAssetTransferDetailsQuery,
  GetAssetTransfersQuery,
  GetAssetTransferDetailsHandler,
  GetAssetTransfersHandler,
} from '../../application';
import { CurrentUser, Permissions } from 'src/modules/auth/presentation';
import type { JwtPayload } from 'src/modules/auth/presentation/interfaces/jwt-payload.interface';
import { AssetTransfer } from '../../domain';
import {
  AssetTransferResponse,
  CancelAssetTransferRequest,
  CreateAssetTransferRequest,
  GetAssetTransfersRequest,
  RejectAssetTransferRequest,
} from '../dto';
import { AssetTransferResult } from '../../application/dtos/asset-transfer.result';

@Controller('asset-transfers')
export class AssetTransferController {
  constructor(
    private readonly createHandler: CreateAssetTransferHandler,
    private readonly approveHandler: ApproveAssetTransferHandler,
    private readonly rejectHandler: RejectAssetTransferHandler,
    private readonly completeHandler: CompleteAssetTransferHandler,
    private readonly cancelHandler: CancelAssetTransferHandler,
    private readonly getListHandler: GetAssetTransfersHandler,
    private readonly getDetailsHandler: GetAssetTransferDetailsHandler,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Permissions('TRANSFER_CREATE')
  @Post()
  async create(
    @Body() dto: CreateAssetTransferRequest,
    @CurrentUser() user: JwtPayload,
  ): Promise<AssetTransferResponse> {
    const cmd = new CreateAssetTransferCommand(
      dto.assetId,
      dto.organizationId,
      dto.transferType,
      dto.transferDate,
      dto.reason || null,
      dto.toDepartmentId || null,
      dto.toUserId || null,
      (user as any).id || (user as any).userId, // Handle different potential JWT payload structures safely
      dto.fromDepartmentId || null,
      dto.fromUserId || null,
    );
    const result = await this.createHandler.execute(cmd);
    return this.toResponseFromEntity(result);
  }

  @Permissions('TRANSFER_APPROVE')
  @Patch(':id/approve')
  async approve(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<AssetTransferResponse> {
    const cmd = new ApproveAssetTransferCommand(id, user.id);
    const result = await this.approveHandler.execute(cmd);
    return this.toResponse(result);
  }

  @Permissions('TRANSFER_APPROVE')
  @Patch(':id/reject')
  async reject(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: RejectAssetTransferRequest,
    @CurrentUser() user: JwtPayload,
  ): Promise<AssetTransferResponse> {
    const cmd = new RejectAssetTransferCommand(id, user.id, dto.reason);
    const result = await this.rejectHandler.execute(cmd);
    return this.toResponseFromEntity(result);
  }

  @Permissions('TRANSFER_UPDATE')
  @Patch(':id/complete')
  async complete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<AssetTransferResponse> {
    const cmd = new CompleteAssetTransferCommand(id);
    const result = await this.completeHandler.execute(cmd);
    return this.toResponseFromEntity(result);
  }

  @Permissions('TRANSFER_UPDATE')
  @Patch(':id/cancel')
  async cancel(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: CancelAssetTransferRequest,
  ): Promise<AssetTransferResponse> {
    const cmd = new CancelAssetTransferCommand(id, dto.reason);
    const result = await this.cancelHandler.execute(cmd);
    return this.toResponseFromEntity(result);
  }

  @Permissions('TRANSFER_VIEW')
  @Get()
  async getList(
    @Query() query: GetAssetTransfersRequest,
    @Query('organizationId') organizationId: string,
  ): Promise<{ data: AssetTransferResponse[]; total: number }> {
    const q: GetAssetTransfersQuery = {
      organizationId: organizationId || '',
      options: {
        status: query.status,
        transferType: query.transferType,
        fromDepartmentId: query.fromDepartmentId,
        toDepartmentId: query.toDepartmentId,
        fromUserId: query.fromUserId,
        toUserId: query.toUserId,
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

  @Permissions('TRANSFER_VIEW')
  @Get(':id')
  async getDetails(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<AssetTransferResponse> {
    const query = new GetAssetTransferDetailsQuery(id);
    const result = await this.getDetailsHandler.execute(query);
    return this.toResponse(result);
  }

  private toResponse(result: AssetTransferResult): AssetTransferResponse {
    return new AssetTransferResponse(result);
  }

  private toResponseFromEntity(entity: AssetTransfer): AssetTransferResponse {
    const result: AssetTransferResult = {
      transfer: entity,
      asset: null,
      organization: null,
      fromDepartment: null,
      toDepartment: null,
      fromUser: null,
      toUser: null,
      approvedByUser: null,
    };
    return new AssetTransferResponse(result);
  }
}
