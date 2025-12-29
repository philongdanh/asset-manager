import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export class Department extends BaseEntity {
    private _organizationId: string;
    private _name: string;
    private _parentId: string | null;

    protected constructor(builder: DepartmentBuilder) {
        super(builder.id, builder.createdAt, builder.updatedAt, builder.deletedAt);
        this._organizationId = builder.organizationId;
        this._name = builder.name;
        this._parentId = builder.parentId;
    }

    // --- Getters ---
    public get organizationId(): string {
        return this._organizationId;
    }

    public get name(): string {
        return this._name;
    }

    public get parentId(): string | null {
        return this._parentId;
    }

    // --- Business Methods ---
    public rename(name: string): void {
        if (!name || name.trim().length === 0) {
            throw new BusinessRuleViolationException(
                'DEPARTMENT_NAME_REQUIRED',
                'Department name cannot be empty.',
            );
        }
        this._name = name;
        this.markAsUpdated();
    }

    public moveToParent(parentId: string | null): void {
        if (parentId === this.id) {
            throw new BusinessRuleViolationException(
                'INVALID_PARENT_DEPARTMENT',
                'A department cannot be its own parent.',
            );
        }
        this._parentId = parentId;
        this.markAsUpdated();
    }

    public updateDetails(name: string, parentId: string | null): void {
        if (!name || name.trim().length === 0) {
            throw new BusinessRuleViolationException(
                'DEPARTMENT_NAME_REQUIRED',
                'Department name cannot be empty.',
            );
        }
        if (parentId === this.id) {
            throw new BusinessRuleViolationException(
                'INVALID_PARENT_DEPARTMENT',
                'A department cannot be its own parent.',
            );
        }
        this._name = name;
        this._parentId = parentId;
        this.markAsUpdated();
    }

    // --- Static Builder Access ---
    public static builder(
        id: string,
        organizationId: string,
        name: string,
    ): DepartmentBuilder {
        return new DepartmentBuilder(id, organizationId, name);
    }

    // Static factory method
    public static createFromBuilder(builder: DepartmentBuilder): Department {
        return new Department(builder);
    }
}

export class DepartmentBuilder {
    public name: string;
    public parentId: string | null = null;
    public createdAt: Date;
    public updatedAt: Date;
    public deletedAt: Date | null = null;

    constructor(
        public readonly id: string,
        public readonly organizationId: string,
        name: string,
    ) {
        this.name = name;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    public withParent(parentId: string | null): this {
        this.parentId = parentId;
        return this;
    }

    public withTimestamps(
        createdAt: Date,
        updatedAt: Date,
        deletedAt?: Date | null,
    ): this {
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt || null;
        return this;
    }

    public build(): Department {
        this.validate();
        return Department.createFromBuilder(this);
    }

    private validate(): void {
        if (!this.id) {
            throw new BusinessRuleViolationException(
                'DEPARTMENT_ID_REQUIRED',
                'Department ID is mandatory.',
            );
        }
        if (!this.organizationId) {
            throw new BusinessRuleViolationException(
                'ORGANIZATION_ID_REQUIRED',
                'Organization ID is mandatory for department.',
            );
        }
        if (!this.name || this.name.trim().length === 0) {
            throw new BusinessRuleViolationException(
                'DEPARTMENT_NAME_INVALID',
                'Department name cannot be empty.',
            );
        }
        if (this.parentId === this.id) {
            throw new BusinessRuleViolationException(
                'SELF_PARENT_NOT_ALLOWED',
                'Department cannot be its own parent.',
            );
        }
    }
}
