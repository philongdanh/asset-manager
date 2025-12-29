import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

// --- Enums ---
export enum AssetDocumentType {
  INVOICE = 'INVOICE',
  CONTRACT = 'CONTRACT',
  WARRANTY = 'WARRANTY',
  MANUAL = 'MANUAL',
  CERTIFICATE = 'CERTIFICATE',
  IMAGE = 'IMAGE',
  SPECIFICATION = 'SPECIFICATION',
  MAINTENANCE_RECORD = 'MAINTENANCE_RECORD',
  INSURANCE = 'INSURANCE',
  LICENSE = 'LICENSE',
  TAX_DOCUMENT = 'TAX_DOCUMENT',
  OTHER = 'OTHER',
}

export class AssetDocument extends BaseEntity {
  private _assetId: string;
  private _organizationId: string;
  private _documentType: AssetDocumentType;
  private _documentName: string;
  private _filePath: string;
  private _fileType: string;
  private _uploadDate: Date;
  private _uploadedByUserId: string;
  private _description: string | null;

  protected constructor(builder: AssetDocumentBuilder) {
    super(builder.id, builder.createdAt, builder.updatedAt);
    this._assetId = builder.assetId;
    this._organizationId = builder.organizationId;
    this._documentType = builder.documentType;
    this._documentName = builder.documentName;
    this._filePath = builder.filePath;
    this._fileType = builder.fileType;
    this._uploadDate = builder.uploadDate;
    this._uploadedByUserId = builder.uploadedByUserId;
    this._description = builder.description;
  }

  // --- Getters ---
  public get assetId(): string {
    return this._assetId;
  }

  public get organizationId(): string {
    return this._organizationId;
  }

  public get documentType(): AssetDocumentType {
    return this._documentType;
  }

  public get documentName(): string {
    return this._documentName;
  }

  public get filePath(): string {
    return this._filePath;
  }

  public get fileType(): string {
    return this._fileType;
  }

  public get uploadDate(): Date {
    return this._uploadDate;
  }

  public get uploadedByUserId(): string {
    return this._uploadedByUserId;
  }

  public get description(): string | null {
    return this._description;
  }

  // --- Business Methods ---
  public updateDocumentInfo(
    documentName: string,
    documentType: AssetDocumentType,
    description: string | null,
  ): void {
    this.validateDocumentName(documentName);

    this._documentName = documentName;
    this._documentType = documentType;
    this._description = description;
    this.markAsUpdated();
  }

  public updateFilePath(newFilePath: string, newFileType: string): void {
    this.validateFilePath(newFilePath);
    this.validateFileType(newFileType);

    this._filePath = newFilePath;
    this._fileType = newFileType;
    this._uploadDate = new Date();
    this.markAsUpdated();
  }

  public rename(newName: string): void {
    this.validateDocumentName(newName);
    this._documentName = newName;
    this.markAsUpdated();
  }

  public updateDescription(description: string | null): void {
    this._description = description;
    this.markAsUpdated();
  }

  public changeDocumentType(newType: AssetDocumentType): void {
    this._documentType = newType;
    this.markAsUpdated();
  }

  // Helper methods
  public isImage(): boolean {
    return this._documentType === AssetDocumentType.IMAGE;
  }

  public isInvoice(): boolean {
    return this._documentType === AssetDocumentType.INVOICE;
  }

  public isWarranty(): boolean {
    return this._documentType === AssetDocumentType.WARRANTY;
  }

  public isContract(): boolean {
    return this._documentType === AssetDocumentType.CONTRACT;
  }

  public isManual(): boolean {
    return this._documentType === AssetDocumentType.MANUAL;
  }

  private validateDocumentName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'DOCUMENT_NAME_REQUIRED',
        'Document name cannot be empty.',
      );
    }
  }

  private validateFilePath(path: string): void {
    if (!path || path.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'FILE_PATH_REQUIRED',
        'File path cannot be empty.',
      );
    }
  }

  private validateFileType(fileType: string): void {
    if (!fileType || fileType.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'FILE_TYPE_REQUIRED',
        'File type cannot be empty.',
      );
    }
  }

  // --- Static Builder Access ---
  public static builder(
    id: string,
    assetId: string,
    organizationId: string,
    documentName: string,
    filePath: string,
    fileType: string,
    uploadedByUserId: string,
  ): AssetDocumentBuilder {
    return new AssetDocumentBuilder(
      id,
      assetId,
      organizationId,
      documentName,
      filePath,
      fileType,
      uploadedByUserId,
    );
  }

  public static createFromBuilder(
    builder: AssetDocumentBuilder,
  ): AssetDocument {
    return new AssetDocument(builder);
  }
}

export class AssetDocumentBuilder {
  public documentType: AssetDocumentType = AssetDocumentType.OTHER;
  public uploadDate: Date = new Date();
  public description: string | null = null;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    public readonly id: string,
    public readonly assetId: string,
    public readonly organizationId: string,
    public readonly documentName: string,
    public readonly filePath: string,
    public readonly fileType: string,
    public readonly uploadedByUserId: string,
  ) {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public ofType(documentType: AssetDocumentType): this {
    this.documentType = documentType;
    return this;
  }

  public uploadedAt(date: Date): this {
    this.uploadDate = date;
    return this;
  }

  public withDescription(description: string | null): this {
    this.description = description;
    return this;
  }

  public withTimestamps(createdAt: Date, updatedAt: Date): this {
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    return this;
  }

  public build(): AssetDocument {
    this.validate();
    return AssetDocument.createFromBuilder(this);
  }

  private validate(): void {
    if (
      !this.id ||
      !this.assetId ||
      !this.organizationId ||
      !this.uploadedByUserId
    ) {
      throw new BusinessRuleViolationException(
        'DOCUMENT_REQUIRED_IDS',
        'ID, Asset ID, Organization ID, and Uploader User ID are mandatory.',
      );
    }

    if (!this.documentName || this.documentName.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'DOCUMENT_NAME_INVALID',
        'Document name cannot be empty.',
      );
    }

    if (!this.filePath || this.filePath.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'FILE_PATH_INVALID',
        'File path cannot be empty.',
      );
    }

    if (!this.fileType || this.fileType.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'FILE_TYPE_INVALID',
        'File type cannot be empty.',
      );
    }

    if (this.uploadDate > new Date()) {
      throw new BusinessRuleViolationException(
        'INVALID_UPLOAD_DATE',
        'Upload date cannot be in the future.',
      );
    }
  }
}
