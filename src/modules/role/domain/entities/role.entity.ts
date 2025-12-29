import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export class Role extends BaseEntity {
    private _organizationId: string;
    private _name: string;

    protected constructor(builder: RoleBuilder) {
        super(builder.id, builder.createdAt, builder.updatedAt);
        this._organizationId = builder.organizationId;
        this._name = builder.name;
    }

    // --- Getters --
    public get organizationId(): string {
        return this._organizationId;
    }

    public get name(): string {
        return this._name;
    }

    // --- Setters --
    public set organizationId(organizationId: string) {
        if (!organizationId) {
            throw new BusinessRuleViolationException(
                'ORGANIZATION_ID_REQUIRED',
                'Organization ID is required.',
            );
        }
        this._organizationId = organizationId;
        this.markAsUpdated();
    }

    public set name(name: string) {
        if (!name || name.trim().length === 0) {
            throw new BusinessRuleViolationException(
                'ROLE_NAME_REQUIRED',
                'Role name cannot be empty.',
            );
        }

        this._name = name;
        this.markAsUpdated();
    }

    // --- Static Factory ---
    public static builder(
        id: string,
        organizationId: string,
        name: string,
    ): RoleBuilder {
        return new RoleBuilder(id, organizationId, name);
    }

    public static createFromBuilder(builder: RoleBuilder): Role {
        return new Role(builder);
    }
}

// --- Builder Class ---
export class RoleBuilder {
    public createdAt: Date;
    public updatedAt: Date;

    constructor(
        public readonly id: string,
        public readonly organizationId: string,
        public readonly name: string,
    ) {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    public withTimestamps(createdAt: Date, updatedAt: Date): this {
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        return this;
    }

    public build(): Role {
        if (!this.id) {
            throw new BusinessRuleViolationException(
                'ROLE_ID_REQUIRED',
                'ID is mandatory for role.',
            );
        }
        if (!this.organizationId) {
            throw new BusinessRuleViolationException(
                'ORGANIZATION_ID_REQUIRED',
                'Organization ID is mandatory for role.',
            );
        }
        if (!this.name || this.name.trim().length === 0) {
            throw new BusinessRuleViolationException(
                'ROLE_NAME_INVALID',
                'Role name cannot be empty.',
            );
        }

        return Role.createFromBuilder(this);
    }
}
