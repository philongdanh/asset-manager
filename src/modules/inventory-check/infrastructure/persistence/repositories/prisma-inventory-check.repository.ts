import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';
import {
  IInventoryCheckRepository,
  InventoryCheck,
} from 'src/modules/inventory-check/domain';
import { InventoryCheckMapper } from '../mappers/inventory-check.mapper';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class PrismaInventoryCheckRepository implements IInventoryCheckRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findById(id: string): Promise<InventoryCheck | null> {
    const raw = await this.prisma.inventoryCheck.findUnique({
      where: { id },
      include: { details: true },
    });
    return raw ? InventoryCheckMapper.toDomain(raw) : null;
  }

  async findAll(
    organizationId: string,
    options?: {
      status?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
      assetIds?: string[];
    },
  ): Promise<{ data: InventoryCheck[]; total: number }> {
    const where: Prisma.InventoryCheckWhereInput = { organizationId };

    if (options?.status) where.status = options.status;
    if (options?.startDate || options?.endDate) {
      where.inventoryDate = {};
      if (options.startDate) where.inventoryDate.gte = options.startDate;
      if (options.endDate) where.inventoryDate.lte = options.endDate;
    }

    if (options?.assetIds && options.assetIds.length > 0) {
      where.details = {
        some: {
          assetId: { in: options.assetIds },
        },
      };
    }

    const [raws, total] = await Promise.all([
      this.prisma.inventoryCheck.findMany({
        where,
        take: options?.limit,
        skip: options?.offset,
        orderBy: { inventoryDate: 'desc' },
        include: {
          details: true,
        },
      }),
      this.prisma.inventoryCheck.count({ where }),
    ]);

    return {
      data: raws.map(InventoryCheckMapper.toDomain),
      total,
    };
  }

  async findByDepartment(departmentId: string): Promise<InventoryCheck[]> {
    const raws = await this.prisma.inventoryCheck.findMany({
      where: {
        creator: {
          departmentId: departmentId,
        },
      },
    });
    return raws.map(InventoryCheckMapper.toDomain);
  }

  async findActiveCheck(
    organizationId: string,
  ): Promise<InventoryCheck | null> {
    const raw = await this.prisma.inventoryCheck.findFirst({
      where: {
        organizationId,
        status: 'IN_PROGRESS',
      },
    });
    return raw ? InventoryCheckMapper.toDomain(raw) : null;
  }

  async hasPendingCheck(departmentId: string): Promise<boolean> {
    const count = await this.prisma.inventoryCheck.count({
      where: {
        status: 'IN_PROGRESS',
        creator: { departmentId },
      },
    });
    return count > 0;
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.inventoryCheck.count({ where: { id } });
    return count > 0;
  }

  async save(inventoryCheck: InventoryCheck): Promise<InventoryCheck> {
    const { data } = InventoryCheckMapper.toPersistence(inventoryCheck);
    const raw = await this.prisma.inventoryCheck.upsert({
      where: { id: inventoryCheck.id },
      update: {
        status: data.status,
        inventoryDate: data.inventoryDate,
        inventoryName: data.inventoryName,
        updatedAt: new Date(),
      },
      create: data,
    });
    return InventoryCheckMapper.toDomain(raw);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.inventoryCheck.delete({ where: { id } });
  }

  async updateCheckDetails(
    inventoryCheckId: string,
    details: Array<{
      assetId: string;
      isFound: boolean;
      actualStatus: string;
      notes?: string;
    }>,
  ): Promise<void> {
    for (const d of details) {
      const existing = await this.prisma.inventoryDetail.findFirst({
        where: { inventoryId: inventoryCheckId, assetId: d.assetId },
      });
      if (existing) {
        await this.prisma.inventoryDetail.update({
          where: { id: existing.id },
          data: {
            physicalStatus: d.actualStatus,
            isMatched: d.isFound,
            notes: d.notes,
            checkedDate: new Date(),
          },
        });
      } else {
        await this.prisma.inventoryDetail.create({
          data: {
            inventoryId: inventoryCheckId,
            assetId: d.assetId,
            physicalStatus: d.actualStatus,
            isMatched: d.isFound,
            notes: d.notes,
            checkedByUserId: '00000000-0000-0000-0000-000000000000',
            checkedDate: new Date(),
          },
        });
      }
    }
  }
}
