import { Role } from '../../domain/entities/role.entity';
import { Permission } from 'src/modules/permission/domain/entities/permission.entity';
import { User } from 'src/modules/user/domain/entities/user.entity';

/**
 * Result DTO for single role operations (create, update, get details)
 */
export class RoleResult {
    constructor(
        public readonly role: Role,
        public readonly permissions: Permission[] = [],
        public readonly users: User[] = [],
    ) { }
}

/**
 * Result DTO for role list queries
 */
export class RoleListResult {
    constructor(
        public readonly data: RoleResult[],
        public readonly total: number,
    ) { }
}
