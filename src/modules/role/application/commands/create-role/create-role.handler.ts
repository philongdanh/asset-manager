import { Injectable, Inject } from '@nestjs/common';
import { CreateRoleCommand } from './create-role.command';
import {
    ROLE_REPOSITORY,
    type IRoleRepository,
    Role,
} from '../../../domain';
import { ID_GENERATOR, type IIdGenerator } from 'src/domain/core/interfaces';

@Injectable()
export class CreateRoleHandler {
    constructor(
        @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: IRoleRepository,
    ) { }

    async execute(command: CreateRoleCommand): Promise<Role> {
        const id = this.idGenerator.generate();
        const role = Role.builder(id, command.orgId, command.name).build();
        if (command.permIds && command.permIds.length > 0)
            await this.roleRepository.assignPermissions(role.id, command.permIds);
        await this.roleRepository.save(role);
        return role;
    }
}
