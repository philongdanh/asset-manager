import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/infrastructure/prisma';
import { AuthController } from './presentation';
import { USER_REPOSITORY } from 'src/modules/user/domain';
import { PrismaUserRepository } from 'src/modules/user/infrastructure';
import { ROLE_REPOSITORY } from 'src/modules/role/domain';
import { PrismaRoleRepository } from 'src/modules/role/infrastructure';
import { PERMISSION_REPOSITORY } from 'src/modules/permission/domain';
import { PrismaPermissionRepository } from 'src/modules/permission/infrastructure';
import { JwtModule } from '@nestjs/jwt';
import { AuthService, SignInHandler } from './application';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, PermissionsGuard } from './presentation';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory(conf: ConfigService) {
        return {
          secret: conf.get('ACCESS_TOKEN_SECRET'),
          signOptions: {
            expiresIn: '60s',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    ConfigService,
    AuthService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: ROLE_REPOSITORY,
      useClass: PrismaRoleRepository,
    },
    {
      provide: PERMISSION_REPOSITORY,
      useClass: PrismaPermissionRepository,
    },
    SignInHandler,
  ],
})
export class AuthModule {}
