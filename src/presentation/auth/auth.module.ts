import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/persistence/prisma';
import { AuthController } from './auth.controller';
import { USER_REPOSITORY } from 'src/domain/identity/user';
import { SignInHandler } from 'src/application/commands/handlers';
import { PrismaUserRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma-user.repository';

@Module({
  controllers: [AuthController],
  providers: [
    PrismaService,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    SignInHandler,
  ],
})
export class AuthModule {}
