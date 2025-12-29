import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

// --- Enums ---
export enum AssetTransferStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    IN_PROGRESS = 'IN_PROGRESS',
}

export enum AssetTransferType {
    INTERNAL = 'INTERNAL',
    DEPARTMENT = 'DEPARTMENT',
    USER = 'USER',
    LOCATION = 'LOCATION',
    REPAIR = 'REPAIR',
    MAINTENANCE = 'MAINTENANCE',
    STORAGE = 'STORAGE',
    OTHER = 'OTHER',
}

export class AssetTransfer extends BaseEntity {
    private _assetId: string;
    private _organizationId: string;
    private _transferDate: Date;
    private _transferType: AssetTransferType;
    private _fromDepartmentId: string | null;
    private _toDepartmentId: string | null;
    private _fromUserId: string | null;
    private _toUserId: string | null;
    private _approvedByUserId: string | null;
    private _reason: string | null;
    private _status: AssetTransferStatus;

    protected constructor(builder: AssetTransferBuilder) {
        super(builder.id, builder.createdAt, builder.updatedAt);
        this._assetId = builder.assetId;
        this._organizationId = builder.organizationId;
        this._transferDate = builder.transferDate;
        this._transferType = builder.transferType;
        this._fromDepartmentId = builder.fromDepartmentId;
        this._toDepartmentId = builder.toDepartmentId;
        this._fromUserId = builder.fromUserId;
        this._toUserId = builder.toUserId;
        this._approvedByUserId = builder.approvedByUserId;
        this._reason = builder.reason;
        this._status = builder.status;
    }

    // --- Getters ---
    public get assetId(): string {
        return this._assetId;
    }

    public get organizationId(): string {
        return this._organizationId;
    }

    public get transferDate(): Date {
        return this._transferDate;
    }

    public get transferType(): AssetTransferType {
        return this._transferType;
    }

    public get fromDepartmentId(): string | null {
        return this._fromDepartmentId;
    }

    public get toDepartmentId(): string | null {
        return this._toDepartmentId;
    }

    public get fromUserId(): string | null {
        return this._fromUserId;
    }

    public get toUserId(): string | null {
        return this._toUserId;
    }

    public get approvedByUserId(): string | null {
        return this._approvedByUserId;
    }

    public get reason(): string | null {
        return this._reason;
    }

    public get status(): AssetTransferStatus {
        return this._status;
    }

    // --- Business Methods ---
    public updateTransferDetails(
        transferDate: Date,
        transferType: AssetTransferType,
        fromDepartmentId: string | null,
        toDepartmentId: string | null,
        fromUserId: string | null,
        toUserId: string | null,
        reason: string | null,
    ): void {
        this.validateTransferDate(transferDate);
        this.validateTransferDestination(
            fromDepartmentId,
            toDepartmentId,
            fromUserId,
            toUserId,
        );

        this._transferDate = transferDate;
        this._transferType = transferType;
        this._fromDepartmentId = fromDepartmentId;
        this._toDepartmentId = toDepartmentId;
        this._fromUserId = fromUserId;
        this._toUserId = toUserId;
        this._reason = reason;
        this.markAsUpdated();
    }

    public approve(approvedByUserId: string): void {
        if (this._status === AssetTransferStatus.APPROVED) {
            throw new BusinessRuleViolationException(
                'ALREADY_APPROVED',
                'Transfer is already approved.',
            );
        }
        if (this._status === AssetTransferStatus.REJECTED) {
            throw new BusinessRuleViolationException(
                'CANNOT_APPROVE_REJECTED',
                'Cannot approve a rejected transfer.',
            );
        }
        if (this._status === AssetTransferStatus.COMPLETED) {
            throw new BusinessRuleViolationException(
                'CANNOT_APPROVE_COMPLETED',
                'Cannot approve a completed transfer.',
            );
        }
        this._status = AssetTransferStatus.APPROVED;
        this._approvedByUserId = approvedByUserId;
        this.markAsUpdated();
    }

    public reject(approvedByUserId: string, reason: string): void {
        if (this._status === AssetTransferStatus.APPROVED) {
            throw new BusinessRuleViolationException(
                'CANNOT_REJECT_APPROVED',
                'Cannot reject an approved transfer.',
            );
        }
        if (this._status === AssetTransferStatus.COMPLETED) {
            throw new BusinessRuleViolationException(
                'CANNOT_REJECT_COMPLETED',
                'Cannot reject a completed transfer.',
            );
        }
        this._status = AssetTransferStatus.REJECTED;
        this._approvedByUserId = approvedByUserId;
        this._reason = reason || this._reason;
        this.markAsUpdated();
    }

    public complete(): void {
        if (this._status !== AssetTransferStatus.APPROVED) {
            throw new BusinessRuleViolationException(
                'TRANSFER_NOT_APPROVED',
                'Only approved transfers can be completed.',
            );
        }
        this._status = AssetTransferStatus.COMPLETED;
        this.markAsUpdated();
    }

    public cancel(reason: string): void {
        if (this._status === AssetTransferStatus.COMPLETED) {
            throw new BusinessRuleViolationException(
                'CANNOT_CANCEL_COMPLETED',
                'Cannot cancel a completed transfer.',
            );
        }
        this._status = AssetTransferStatus.CANCELLED;
        this._reason = reason || this._reason;
        this.markAsUpdated();
    }

    public markAsInProgress(): void {
        if (this._status !== AssetTransferStatus.APPROVED) {
            throw new BusinessRuleViolationException(
                'TRANSFER_NOT_APPROVED',
                'Only approved transfers can be marked as in progress.',
            );
        }
        this._status = AssetTransferStatus.IN_PROGRESS;
        this.markAsUpdated();
    }

    // Validation methods
    private validateTransferDate(date: Date): void {
        if (date > new Date()) {
            throw new BusinessRuleViolationException(
                'INVALID_TRANSFER_DATE',
                'Transfer date cannot be in the future.',
            );
        }
    }

    private validateTransferDestination(
        fromDepartmentId: string | null,
        toDepartmentId: string | null,
        fromUserId: string | null,
        toUserId: string | null,
    ): void {
        if (fromDepartmentId === toDepartmentId && fromUserId === toUserId) {
            throw new BusinessRuleViolationException(
                'INVALID_TRANSFER_DESTINATION',
                'Source and destination of transfer cannot be the same.',
            );
        }
    }

    // Helper methods
    public isPending(): boolean {
        return this._status === AssetTransferStatus.PENDING;
    }

    public isApproved(): boolean {
        return this._status === AssetTransferStatus.APPROVED;
    }

    public isCompleted(): boolean {
        return this._status === AssetTransferStatus.COMPLETED;
    }

    public isRejected(): boolean {
        return this._status === AssetTransferStatus.REJECTED;
    }

    public isInProgress(): boolean {
        return this._status === AssetTransferStatus.IN_PROGRESS;
    }

    // --- Static Builder Access ---
    public static builder(
        id: string,
        assetId: string,
        organizationId: string,
        transferType: AssetTransferType,
    ): AssetTransferBuilder {
        return new AssetTransferBuilder(id, assetId, organizationId, transferType);
    }

    public static createFromBuilder(
        builder: AssetTransferBuilder,
    ): AssetTransfer {
        return new AssetTransfer(builder);
    }
}

export class AssetTransferBuilder {
    public transferDate: Date = new Date();
    public fromDepartmentId: string | null = null;
    public toDepartmentId: string | null = null;
    public fromUserId: string | null = null;
    public toUserId: string | null = null;
    public approvedByUserId: string | null = null;
    public reason: string | null = null;
    public status: AssetTransferStatus = AssetTransferStatus.PENDING;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(
        public readonly id: string,
        public readonly assetId: string,
        public readonly organizationId: string,
        public readonly transferType: AssetTransferType,
    ) {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    public onDate(date: Date): this {
        this.transferDate = date;
        return this;
    }

    public fromDepartment(departmentId: string | null): this {
        this.fromDepartmentId = departmentId;
        return this;
    }

    public toDepartment(departmentId: string | null): this {
        this.toDepartmentId = departmentId;
        return this;
    }

    public fromUser(userId: string | null): this {
        this.fromUserId = userId;
        return this;
    }

    public toUser(userId: string | null): this {
        this.toUserId = userId;
        return this;
    }

    public approvedBy(userId: string | null): this {
        this.approvedByUserId = userId;
        return this;
    }

    public withReason(reason: string | null): this {
        this.reason = reason;
        return this;
    }

    public withStatus(status: AssetTransferStatus): this {
        this.status = status;
        return this;
    }

    public withTimestamps(createdAt: Date, updatedAt: Date): this {
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        return this;
    }

    public build(): AssetTransfer {
        this.validate();
        return AssetTransfer.createFromBuilder(this);
    }

    private validate(): void {
        if (!this.id || !this.assetId || !this.organizationId) {
            throw new BusinessRuleViolationException(
                'TRANSFER_REQUIRED_FIELDS',
                'ID, Asset ID, and Organization ID are mandatory.',
            );
        }

        if (this.transferDate > new Date()) {
            throw new BusinessRuleViolationException(
                'INVALID_TRANSFER_DATE',
                'Transfer date cannot be in the future.',
            );
        }

        if (
            this.fromDepartmentId === this.toDepartmentId &&
            this.fromUserId === this.toUserId
        ) {
            throw new BusinessRuleViolationException(
                'INVALID_TRANSFER_DESTINATION',
                'Source and destination of transfer cannot be the same.',
            );
        }

        if (
            this.status === AssetTransferStatus.APPROVED &&
            !this.approvedByUserId
        ) {
            throw new BusinessRuleViolationException(
                'APPROVER_REQUIRED',
                'Approved transfers must have an approver.',
            );
        }
    }
}
