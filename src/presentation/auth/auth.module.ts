import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/persistence/prisma';
import { AuthController } from './auth.controller';
import { USER_REPOSITORY } from 'src/domain/identity/user';
import { SignInHandler } from 'src/application/commands/handlers';
import { PrismaUserRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma-user.repository';
import { ROLE_REPOSITORY } from 'src/domain/identity/role';
import { PrismaRoleRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma-role.repository';
import { PERMISSION_REPOSITORY } from 'src/domain/identity/permission';
import { PrismaPermissionRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma-permission.repository';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

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
