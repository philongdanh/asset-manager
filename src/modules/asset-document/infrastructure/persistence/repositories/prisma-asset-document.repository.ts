import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import {
  IAssetDocumentRepository,
  AssetDocument,
  AssetDocumentType,
} from '../../../domain';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';
import { AssetDocumentMapper } from '../mappers/asset-document.mapper';

@Injectable()
export class PrismaAssetDocumentRepository implements IAssetDocumentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<AssetDocument | null> {
    const raw = await this.prisma.assetDocument.findUnique({ where: { id } });
    return raw ? AssetDocumentMapper.toDomain(raw) : null;
  }

  async findByAssetId(assetId: string): Promise<AssetDocument[]> {
    const raws = await this.prisma.assetDocument.findMany({
      where: { assetId },
      orderBy: { uploadDate: 'desc' },
    });
    return raws.map((r) => AssetDocumentMapper.toDomain(r));
  }

  async findByOrganization(organizationId: string): Promise<AssetDocument[]> {
    const raws = await this.prisma.assetDocument.findMany({
      where: { organizationId },
      orderBy: { uploadDate: 'desc' },
    });
    return raws.map((r) => AssetDocumentMapper.toDomain(r));
  }

  async findByUploader(uploadedByUserId: string): Promise<AssetDocument[]> {
    const raws = await this.prisma.assetDocument.findMany({
      where: { uploadedByUserId },
      orderBy: { uploadDate: 'desc' },
    });
    return raws.map((r) => AssetDocumentMapper.toDomain(r));
  }

  async findByDocumentType(
    organizationId: string,
    documentType: AssetDocumentType,
  ): Promise<AssetDocument[]> {
    const raws = await this.prisma.assetDocument.findMany({
      where: { organizationId, documentType },
      orderBy: { uploadDate: 'desc' },
    });
    return raws.map((r) => AssetDocumentMapper.toDomain(r));
  }

  async findAll(
    organizationId: string,
    options?: {
      documentType?: AssetDocumentType;
      assetId?: string;
      uploadedByUserId?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
      search?: string;
    },
  ): Promise<{ data: AssetDocument[]; total: number }> {
    const where: Prisma.AssetDocumentWhereInput = { organizationId };

    if (options?.documentType) where.documentType = options.documentType;
    if (options?.assetId) where.assetId = options.assetId;
    if (options?.uploadedByUserId)
      where.uploadedByUserId = options.uploadedByUserId;
    if (options?.startDate && options?.endDate) {
      where.uploadDate = { gte: options.startDate, lte: options.endDate };
    }
    if (options?.search) {
      where.documentName = { contains: options.search, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      this.prisma.assetDocument.findMany({
        where,
        take: options?.limit,
        skip: options?.offset,
        orderBy: { uploadDate: 'desc' },
      }),
      this.prisma.assetDocument.count({ where }),
    ]);

    return {
      data: data.map((r) => AssetDocumentMapper.toDomain(r)),
      total,
    };
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.assetDocument.count({ where: { id } });
    return count > 0;
  }

  async existsByFilePath(filePath: string): Promise<boolean> {
    const count = await this.prisma.assetDocument.count({
      where: { filePath },
    });
    return count > 0;
  }

  async save(document: AssetDocument): Promise<AssetDocument> {
    const { data } = AssetDocumentMapper.toPersistence(document);
    const raw = await this.prisma.assetDocument.create({ data });
    return AssetDocumentMapper.toDomain(raw);
  }

  async update(document: AssetDocument): Promise<AssetDocument> {
    const { data } = AssetDocumentMapper.toPersistence(document);
    const raw = await this.prisma.assetDocument.update({
      where: { id: document.id },
      data,
    });
    return AssetDocumentMapper.toDomain(raw);
  }

  async saveMany(documents: AssetDocument[]): Promise<void> {
    const data = documents.map(
      (d) => AssetDocumentMapper.toPersistence(d).data,
    );
    await this.prisma.$transaction(
      data.map((d) => this.prisma.assetDocument.create({ data: d })),
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.assetDocument.delete({ where: { id } });
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.prisma.assetDocument.deleteMany({ where: { id: { in: ids } } });
  }

  async deleteByAssetId(assetId: string): Promise<void> {
    await this.prisma.assetDocument.deleteMany({ where: { assetId } });
  }

  async getDocumentsSummary(organizationId: string): Promise<{
    totalCount: number;
    byType: Record<AssetDocumentType, number>;
    byAsset: Record<string, number>;
    recentUploads: Array<{
      documentId: string;
      documentName: string;
      assetId: string;
      uploadDate: Date;
      uploadedBy: string;
    }>;
  }> {
    const documents = await this.prisma.assetDocument.findMany({
      where: { organizationId },
      select: {
        id: true,
        documentType: true,
        assetId: true,
        documentName: true,
        uploadDate: true,
        uploadedByUserId: true,
      },
      orderBy: { uploadDate: 'desc' },
    });

    const result = {
      totalCount: documents.length,
      byType: {} as Record<AssetDocumentType, number>,
      byAsset: {} as Record<string, number>,
      recentUploads: [] as Array<{
        documentId: string;
        documentName: string;
        assetId: string;
        uploadDate: Date;
        uploadedBy: string;
      }>,
    };

    Object.values(AssetDocumentType).forEach((t) => (result.byType[t] = 0));

    for (const d of documents) {
      result.byType[d.documentType as AssetDocumentType]++;
      result.byAsset[d.assetId] = (result.byAsset[d.assetId] || 0) + 1;
    }

    result.recentUploads = documents.slice(0, 10).map((d) => ({
      documentId: d.id,
      documentName: d.documentName,
      assetId: d.assetId,
      uploadDate: d.uploadDate,
      uploadedBy: d.uploadedByUserId,
    }));

    return result;
  }

  async findDocumentsByFileType(
    organizationId: string,
    fileType: string,
  ): Promise<AssetDocument[]> {
    const raws = await this.prisma.assetDocument.findMany({
      where: { organizationId, fileType },
      orderBy: { uploadDate: 'desc' },
    });
    return raws.map((r) => AssetDocumentMapper.toDomain(r));
  }

  async findRecentDocuments(
    organizationId: string,
    limit: number,
  ): Promise<AssetDocument[]> {
    const raws = await this.prisma.assetDocument.findMany({
      where: { organizationId },
      orderBy: { uploadDate: 'desc' },
      take: limit,
    });
    return raws.map((r) => AssetDocumentMapper.toDomain(r));
  }

  async getDocumentTypeDistribution(
    organizationId: string,
  ): Promise<Record<AssetDocumentType, number>> {
    const documents = await this.prisma.assetDocument.findMany({
      where: { organizationId },
      select: { documentType: true },
    });

    const result = {} as Record<AssetDocumentType, number>;
    Object.values(AssetDocumentType).forEach((t) => (result[t] = 0));
    for (const d of documents) {
      result[d.documentType as AssetDocumentType]++;
    }
    return result;
  }

  async getUploadActivity(
    organizationId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Array<{ date: string; count: number }>> {
    const raws = await this.prisma.$queryRaw<any[]>`
            SELECT DATE(upload_date) as date, COUNT(*) as count
            FROM "AssetDocuments"
            WHERE organization_id = ${organizationId}
              AND upload_date >= ${startDate}
              AND upload_date <= ${endDate}
            GROUP BY DATE(upload_date)
            ORDER BY date ASC
        `;
    return raws.map((r) => ({
      date: new Date(r.date).toISOString().split('T')[0],
      count: Number(r.count),
    }));
  }

  async findByAssetIds(
    assetIds: string[],
  ): Promise<Record<string, AssetDocument[]>> {
    const raws = await this.prisma.assetDocument.findMany({
      where: { assetId: { in: assetIds } },
      orderBy: { uploadDate: 'desc' },
    });

    const result: Record<string, AssetDocument[]> = {};
    for (const assetId of assetIds) {
      result[assetId] = [];
    }
    for (const r of raws) {
      result[r.assetId].push(AssetDocumentMapper.toDomain(r));
    }
    return result;
  }
}
