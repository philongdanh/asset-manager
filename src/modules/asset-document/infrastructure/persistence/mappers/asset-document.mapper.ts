import {
    AssetDocument,
    AssetDocumentType,
} from '../../../domain';
import { AssetDocument as PrismaAssetDocument } from 'generated/prisma/client';

export class AssetDocumentMapper {
    static toDomain(raw: PrismaAssetDocument): AssetDocument {
        const builder = AssetDocument.builder(
            raw.id,
            raw.assetId,
            raw.organizationId,
            raw.documentName,
            raw.filePath,
            raw.fileType,
            raw.uploadedByUserId,
        )
            .ofType(raw.documentType as AssetDocumentType)
            .uploadedAt(raw.uploadDate)
            .withDescription(raw.description)
            .withTimestamps(raw.createdAt, raw.updatedAt);

        return builder.build();
    }

    static toPersistence(domain: AssetDocument): {
        data: Omit<PrismaAssetDocument, 'createdAt' | 'updatedAt'>;
    } {
        return {
            data: {
                id: domain.id,
                assetId: domain.assetId,
                organizationId: domain.organizationId,
                documentType: domain.documentType,
                documentName: domain.documentName,
                filePath: domain.filePath,
                fileType: domain.fileType,
                uploadDate: domain.uploadDate,
                uploadedByUserId: domain.uploadedByUserId,
                description: domain.description,
            },
        };
    }
}
