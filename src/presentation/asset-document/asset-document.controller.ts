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
} from 'src/application/commands/asset-document';
import {
    UploadAssetDocumentHandler,
    DeleteAssetDocumentHandler,
} from 'src/application/commands/asset-document/handlers';
import { GetAssetDocumentsQuery, GetAssetDocumentByIdQuery } from 'src/application/queries/asset-document';
import {
    GetAssetDocumentsHandler,
    GetAssetDocumentDetailsHandler,
} from 'src/application/queries/handlers';
import { Permissions } from 'src/modules/auth/presentation';
import { AssetDocumentResponse, UploadAssetDocumentRequest } from './dto';

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
        const q = new GetAssetDocumentsQuery(organizationId || '', { assetId, limit, offset });
        const result = await this.getListHandler.execute(q);
        return {
            data: result.data.map(item => this.toResponse(item)),
            total: result.total,
        };
    }

    @Permissions('DOCUMENT_VIEW')
    @Get(':id')
    async getDetails(
        @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    ): Promise<AssetDocumentResponse> {
        const query = new GetAssetDocumentByIdQuery(id);
        const result = await this.getDetailsHandler.execute(query);
        return this.toResponse(result);
    }

    private toResponse(entity: any): AssetDocumentResponse {
        return <AssetDocumentResponse>{
            id: entity.id,
            assetId: entity.assetId,
            organizationId: entity.organizationId,
            documentType: entity.documentType,
            documentName: entity.documentName,
            filePath: entity.filePath,
            fileType: entity.fileType,
            uploadDate: entity.uploadDate,
            uploadedByUserId: entity.uploadedByUserId,
            description: entity.description,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
