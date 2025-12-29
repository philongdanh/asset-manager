import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  RecordDepreciationCommand,
  RecordDepreciationHandler,
  GetAssetDepreciationsQuery,
  GetAssetDepreciationDetailsQuery,
  GetAssetDepreciationsHandler,
  GetAssetDepreciationDetailsHandler,
} from '../../application';
import { Permissions } from 'src/modules/auth/presentation';
import { AssetDepreciation } from '../../domain';
import { AssetDepreciationResponse, RecordDepreciationRequest } from '../dto';

@Controller('asset-depreciations')
export class AssetDepreciationController {
  constructor(
    private readonly recordHandler: RecordDepreciationHandler,
    private readonly getListHandler: GetAssetDepreciationsHandler,
    private readonly getDetailsHandler: GetAssetDepreciationDetailsHandler,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Permissions('DEPRECIATION_CREATE')
  @Post()
  async record(
    @Body() dto: RecordDepreciationRequest,
  ): Promise<AssetDepreciationResponse> {
    const cmd = new RecordDepreciationCommand(
      dto.assetId,
      dto.organizationId,
      dto.method,
      dto.depreciationDate,
      dto.depreciationValue,
      dto.accumulatedDepreciation,
      dto.remainingValue,
    );
    const result = await this.recordHandler.execute(cmd);
    return this.toResponse(result);
  }

  @Permissions('DEPRECIATION_VIEW')
  @Get()
  async getList(
    @Query('organizationId') organizationId: string,
    @Query('assetId') assetId?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<{ data: AssetDepreciationResponse[]; total: number }> {
    const q = new GetAssetDepreciationsQuery(organizationId || '', {
      assetId,
      limit,
      offset,
    });
    const result = await this.getListHandler.execute(q);
    return {
      data: result.data.map((item) => this.toResponse(item)),
      total: result.total,
    };
  }

  @Permissions('DEPRECIATION_VIEW')
  @Get(':id')
  async getDetails(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<AssetDepreciationResponse> {
    const query = new GetAssetDepreciationDetailsQuery(id);
    const result = await this.getDetailsHandler.execute(query);
    return this.toResponse(result);
  }

  private toResponse(entity: AssetDepreciation): AssetDepreciationResponse {
    return new AssetDepreciationResponse({
      id: entity.id,
      assetId: entity.assetId,
      organizationId: entity.organizationId,
      depreciationDate: entity.depreciationDate,
      method: entity.method,
      depreciationValue: entity.depreciationValue,
      accumulatedDepreciation: entity.accumulatedDepreciation,
      remainingValue: entity.remainingValue,
      accountingEntryId: entity.accountingEntryId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
