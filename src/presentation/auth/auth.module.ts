import { Module } from '@nestjs/common';
import { PrismaAssetRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma-asset.repository';
import { PrismaService } from 'src/infrastructure/persistence/prisma';
import { AuthController } from './auth.controller';
import { USER_REPOSITORY } from 'src/domain/identity/user';
import { SignInHandler } from 'src/application/commands/handlers';

@Module({
  controllers: [AuthController],
  providers: [
    PrismaService,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaAssetRepository,
    },
    SignInHandler,
  ],
})
export class AuthModule {}
