import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import {
  IInventoryDetailRepository,
  InventoryDetail,
} from 'src/modules/inventory-check/domain';
import { InventoryDetailMapper } from '../mappers/inventory-detail.mapper';

@Injectable()
export class PrismaInventoryDetailRepository implements IInventoryDetailRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<InventoryDetail | null> {
    const raw = await this.prisma.inventoryDetail.findUnique({ where: { id } });
    return raw ? InventoryDetailMapper.toDomain(raw) : null;
  }

  async findByCheckId(inventoryCheckId: string): Promise<InventoryDetail[]> {
    const raws = await this.prisma.inventoryDetail.findMany({
      where: { inventoryId: inventoryCheckId },
    });
    return raws.map(InventoryDetailMapper.toDomain);
  }

  async findByCheckAndAsset(
    inventoryCheckId: string,
    assetId: string,
  ): Promise<InventoryDetail | null> {
    const raw = await this.prisma.inventoryDetail.findFirst({
      where: { inventoryId: inventoryCheckId, assetId },
    });
    return raw ? InventoryDetailMapper.toDomain(raw) : null;
  }

  async findMissingAssets(
    inventoryCheckId: string,
  ): Promise<InventoryDetail[]> {
    const raws = await this.prisma.inventoryDetail.findMany({
      where: { inventoryId: inventoryCheckId, physicalStatus: 'MISSING' },
    });
    return raws.map(InventoryDetailMapper.toDomain);
  }

  async findStatusDiscrepancies(
    inventoryCheckId: string,
  ): Promise<InventoryDetail[]> {
    const raws = await this.prisma.inventoryDetail.findMany({
      where: { inventoryId: inventoryCheckId, isMatched: false },
    });
    return raws.map(InventoryDetailMapper.toDomain);
  }

  async save(detail: InventoryDetail): Promise<InventoryDetail> {
    const { data } = InventoryDetailMapper.toPersistence(detail);
    const raw = await this.prisma.inventoryDetail.upsert({
      where: { id: detail.id },
      update: {
        physicalStatus: data.physicalStatus,
        isMatched: data.isMatched,
        notes: data.notes,
        checkedDate: data.checkedDate,
        updatedAt: new Date(),
      },
      create: data,
    });
    return InventoryDetailMapper.toDomain(raw);
  }

  async saveMany(details: InventoryDetail[]): Promise<void> {
    for (const d of details) {
      await this.save(d);
    }
  }

  async delete(id: string): Promise<void> {
    await this.prisma.inventoryDetail.delete({ where: { id } });
  }

  async createInitialDetails(
    inventoryCheckId: string,
    assetIds: string[],
  ): Promise<void> {
    await this.prisma.inventoryDetail.createMany({
      data: assetIds.map((assetId) => ({
        inventoryId: inventoryCheckId,
        assetId,
        physicalStatus: 'PENDING',
        isMatched: false,
        checkedByUserId: '00000000-0000-0000-0000-000000000000',
        checkedDate: new Date(),
      })),
    });
  }
}
