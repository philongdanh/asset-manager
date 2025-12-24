import { Module } from '@nestjs/common';
import { PrismaAssetRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma-asset.repository';
import { UuidGeneratorService } from 'src/infrastructure/common/id-generator';
import { PrismaService } from 'src/infrastructure/persistence/prisma';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { UserController } from './user.controller';
import { CreateUserCommand } from 'src/application/identity/commands/create-user';
import { USER_REPOSITORY } from 'src/domain/identity/user';

@Module({
  controllers: [UserController],
  providers: [
    PrismaService,
    {
      provide: ID_GENERATOR,
      useClass: UuidGeneratorService,
    },
    {
      provide: USER_REPOSITORY,
      useClass: PrismaAssetRepository,
    },
    CreateUserCommand,
  ],
})
export class UserModule {}
