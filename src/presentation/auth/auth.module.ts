import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/persistence/prisma';
import { AuthController } from './auth.controller';
import { USER_REPOSITORY } from 'src/domain/identity/user';
import { SignInHandler } from 'src/application/commands/handlers';
import { PrismaUserRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma-user.repository';
import { ROLE_REPOSITORY } from 'src/domain/identity/role';
import { PrismaRoleRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma-role.repository';
import { ORGANIZATION_REPOSITORY } from 'src/domain/identity/organization';
import { PrismaOrganizationRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma-organization.repository';

@Module({
  controllers: [AuthController],
  providers: [
    PrismaService,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: ORGANIZATION_REPOSITORY,
      useClass: PrismaOrganizationRepository,
    },
    SignInHandler,
    {
      provide: ROLE_REPOSITORY,
      useClass: PrismaRoleRepository,
    },
    SignInHandler,
  ],
})
export class AuthModule {}
