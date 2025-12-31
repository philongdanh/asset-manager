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
import { Permissions } from 'src/modules/auth/presentation';
import { AssetDocument } from '../../domain';
import { AssetDocumentResponse, UploadAssetDocumentRequest } from '../dto';

@Controller('asset-documents')
export class AssetDocumentController {
  constructor(
    private readonly uploadHandler: UploadAssetDocumentHandler,
    private readonly deleteHandler: DeleteAssetDocumentHandler,
    private readonly getListHandler: GetAssetDocumentsHandler,
    private readonly getDetailsHandler: GetAssetDocumentDetailsHandler,
  ) { }

  @HttpCode(HttpStatus.CREATED)
  @Permissions('DOCUMENT_CREATE')
  @Post()
  async upload(
    @Body() dto: UploadAssetDocumentRequest,
    @Query('userId') userId: string,
  ): Promise<AssetDocumentResponse> {
    const uploaderId = userId || '00000000-0000-0000-0000-000000000000';
    const cmd = new UploadAssetDocumentCommand(
      dto.assetId,
      dto.organizationId,
      uploaderId,
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
    @Query('organizationId') organizationId: string,
    @Query('assetId') assetId?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<{ data: AssetDocumentResponse[]; total: number }> {
    const q = new GetAssetDocumentsQuery(organizationId || '', {
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
