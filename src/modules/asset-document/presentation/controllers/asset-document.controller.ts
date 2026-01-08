import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  UploadAssetDocumentCommand,
  DeleteAssetDocumentCommand,
  UploadAssetDocumentHandler,
  DeleteAssetDocumentHandler,
  GetAssetDocumentDetailsQuery,
  GetAssetDocumentsQuery,
  GetAssetDocumentDetailsHandler,
  GetAssetDocumentsHandler,
} from '../../application';
import { CurrentUser, Permissions } from 'src/modules/auth/presentation';
import type { JwtPayload } from 'src/modules/auth/presentation/interfaces/jwt-payload.interface';
import { AssetDocument } from '../../domain';
import { AssetDocumentResponse, UploadAssetDocumentRequest } from '../dto';

@Controller('asset-documents')
export class AssetDocumentController {
  constructor(
    private readonly uploadHandler: UploadAssetDocumentHandler,
    private readonly deleteHandler: DeleteAssetDocumentHandler,
    private readonly getListHandler: GetAssetDocumentsHandler,
    private readonly getDetailsHandler: GetAssetDocumentDetailsHandler,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Permissions('DOCUMENT_CREATE')
  @Post()
  async upload(
    @Body() dto: UploadAssetDocumentRequest,
    @CurrentUser() user: JwtPayload,
  ): Promise<AssetDocumentResponse> {
    // Use organizationId from JWT if not root, otherwise require from body
    const organizationId = user.isRoot
      ? dto.organizationId
      : user.organizationId!;
    const cmd = new UploadAssetDocumentCommand(
      dto.assetId,
      organizationId,
      user.id, // uploader is the current user
      dto.documentName,
      dto.filePath,
      dto.fileType,
      dto.documentType,
      dto.description || null,
    );
    const result = await this.uploadHandler.execute(cmd);
    return this.toResponse(result);
  }

  @Permissions('DOCUMENT_DELETE')
  @Delete(':id')
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    const cmd = new DeleteAssetDocumentCommand(id);
    await this.deleteHandler.execute(cmd);
  }

  @Permissions('DOCUMENT_VIEW')
  @Get()
  async getList(
    @CurrentUser() user: JwtPayload,
    @Query('organizationId') organizationId?: string,
    @Query('assetId') assetId?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<{ data: AssetDocumentResponse[]; total: number }> {
    // Use organizationId from JWT if not root
    const orgId = user.isRoot ? organizationId || '' : user.organizationId!;
    const q = new GetAssetDocumentsQuery(orgId, {
      assetId,
      limit: limit ? Number(limit) : 10,
      offset: offset ? Number(offset) : 0,
    });
    const result = await this.getListHandler.execute(q);
    return {
      data: result.data.map((item) => this.toResponse(item)),
      total: result.total,
    };
  }

  @Permissions('DOCUMENT_VIEW')
  @Get(':id')
  async getDetails(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<AssetDocumentResponse> {
    const query = new GetAssetDocumentDetailsQuery(id);
    const result = await this.getDetailsHandler.execute(query);
    return this.toResponse(result);
  }

  private toResponse(entity: AssetDocument): AssetDocumentResponse {
    return new AssetDocumentResponse(entity);
  }
}
