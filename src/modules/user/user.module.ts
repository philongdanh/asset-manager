import { Module } from '@nestjs/common';
import {
  CreateUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
  GetUsersHandler,
  GetUserDetailsHandler,
} from './application';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { USER_REPOSITORY } from './domain';
import { UuidGeneratorService } from 'src/shared/infrastructure/id-generator';
import { PrismaService } from 'src/shared/infrastructure/prisma';
import { PrismaUserRepository } from './infrastructure';
import { UserController } from './presentation';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
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
    UpdateUserHandler,
    DeleteUserHandler,
  ],
  exports: [USER_REPOSITORY],
})
export class UserModule {}
