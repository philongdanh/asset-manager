import { Module } from '@nestjs/common';
import { CreateUserHandler } from 'src/application/commands/handlers';
import {
  GetUserDetailsHandler,
  GetUsersHandler,
} from 'src/application/queries/handlers';
import { ID_GENERATOR } from 'src/domain/core/interfaces';
import { USER_REPOSITORY } from 'src/domain/identity/user';
import { UuidGeneratorService } from 'src/infrastructure/common/id-generator';
import { PrismaService } from 'src/infrastructure/persistence/prisma';
import { PrismaUserRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma-user.repository';
import { UserController } from './user.controller';

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
      useClass: PrismaUserRepository,
    },
    CreateUserHandler,
    GetUsersHandler,
    GetUserDetailsHandler,
  ],
})
export class UserModule {}
