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
import { AssetDepreciationResult } from '../../application/dtos/asset-depreciation.result';
import { CurrentUser, Permissions } from 'src/modules/auth/presentation';
import type { JwtPayload } from '../../../auth/presentation/interfaces/jwt-payload.interface';
import { AssetDepreciation } from '../../domain';
import { AssetDepreciationResponse, RecordDepreciationRequest } from '../dto';

@Controller('asset-depreciations')
export class AssetDepreciationController {
  constructor(
    private readonly recordHandler: RecordDepreciationHandler,
    private readonly getListHandler: GetAssetDepreciationsHandler,
    private readonly getDetailsHandler: GetAssetDepreciationDetailsHandler,
  ) { }

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
    return this.toResponse({
      depreciation: result,
      asset: null,
      organization: null,
    });
  }

  @Permissions('DEPRECIATION_VIEW')
  @Get()
  async getList(
    @Query('organizationId') organizationId: string,
    @Query('assetId') assetId: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @CurrentUser() user: JwtPayload,
  ): Promise<{ data: AssetDepreciationResponse[]; total: number }> {
    const orgId = user.isRoot
      ? organizationId || ''
      : user.organizationId || '';

    const q = new GetAssetDepreciationsQuery(orgId, {
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

  private toResponse(
    result: AssetDepreciationResult,
  ): AssetDepreciationResponse {
    return new AssetDepreciationResponse(result);
  }
}
