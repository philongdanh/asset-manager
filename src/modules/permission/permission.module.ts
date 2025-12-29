import { Module } from '@nestjs/common';
import { ID_GENERATOR } from 'src/domain/core/interfaces';
import { UuidGeneratorService } from 'src/infrastructure/common/id-generator';
import { PrismaService } from 'src/infrastructure/persistence/prisma';
import { PERMISSION_REPOSITORY } from './domain';
import { PrismaPermissionRepository } from './infrastructure';
import { CreatePermissionHandler, GetPermissionsHandler } from './application';
import { PermissionController } from './presentation';

@Module({
    controllers: [PermissionController],
    providers: [
        PrismaService,
        {
            provide: ID_GENERATOR,
            useClass: UuidGeneratorService,
        },
        {
            provide: PERMISSION_REPOSITORY,
            useClass: PrismaPermissionRepository,
        },
        CreatePermissionHandler,
        GetPermissionsHandler,
    ],
})
export class PermissionModule { }
