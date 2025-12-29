import * as bcrypt from 'bcrypt';
import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
    USER_REPOSITORY,
    type IUserRepository,
} from 'src/modules/user/domain';
import { SignInCommand } from './sign-in.command';
import {
    type IRoleRepository,
    ROLE_REPOSITORY,
} from 'src/modules/role/domain';
import {
    type IPermissionRepository,
    PERMISSION_REPOSITORY,
} from 'src/modules/permission/domain';

@Injectable()
export class SignInHandler {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepo: IUserRepository,
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepo: IRoleRepository,
        @Inject(PERMISSION_REPOSITORY)
        private readonly permRepo: IPermissionRepository,
    ) { }

    async execute(cmd: SignInCommand) {
        const user = await this.userRepo.findByUsername(cmd.orgId, cmd.username);
        if (!user) {
            throw new UseCaseException(
                `Invalid username or password`,
                SignInCommand.name,
            );
        }

        if (user.isInactive()) {
            throw new UseCaseException(`Account is inactive`, SignInCommand.name);
        }

        const isPasswordValid = await bcrypt.compare(cmd.password, user.password);
        if (!isPasswordValid) {
            throw new UseCaseException(
                `Invalid username or password`,
                SignInCommand.name,
            );
        }

        const roles = await this.roleRepo.findByUserId(user.id);
        const permissions = await this.permRepo.findByRoles(
            roles.map((role) => role.id),
        );

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            organizationId: user.organizationId,
            departmentId: user.departmentId,
            status: user.status,
            roles: roles.map((role) => role.name),
            permissions: permissions.map((perm) => perm.id),
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
