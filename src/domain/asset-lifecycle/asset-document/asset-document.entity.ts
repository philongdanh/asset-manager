import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export class AssetDocument extends BaseEntity {
  private _assetId: string;
  private _organizationId: string;
  private _documentName: string;
  private _documentType: string; // e.g., 'CONTRACT', 'MANUAL', 'IMAGE'
  private _fileUrl: string;
  private _fileKey: string | null;
  private _fileSize: number | null;
  private _mimeType: string | null;
  private _uploadedAt: Date;

  protected constructor(builder: AssetDocumentBuilder) {
    super(builder.id);
    this._assetId = builder.assetId;
    this._organizationId = builder.organizationId;
    this._documentName = builder.documentName;
    this._documentType = builder.documentType;
    this._fileUrl = builder.fileUrl;
    this._fileKey = builder.fileKey;
    this._fileSize = builder.fileSize;
    this._mimeType = builder.mimeType;
    this._uploadedAt = builder.uploadedAt;
  }

  // --- Getters ---
  public get assetId(): string {
    return this._assetId;
  }

  public get organizationId(): string {
    return this._organizationId;
  }

  public get documentName(): string {
    return this._documentName;
  }

  public get documentType(): string {
    return this._documentType;
  }

  public get fileUrl(): string {
    return this._fileUrl;
  }

  public get fileKey(): string | null {
    return this._fileKey;
  }

  public get fileSize(): number | null {
    return this._fileSize;
  }

  public get mimeType(): string | null {
    return this._mimeType;
  }

  public get uploadedAt(): Date {
    return this._uploadedAt;
  }

  // --- Business Methods ---
  public rename(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'DOCUMENT_NAME_REQUIRED',
        'Document name cannot be empty.',
      );
    }
    this._documentName = newName;
  }

  // --- Static Builder Access ---
  public static builder(
    id: string,
    assetId: string,
    organizationId: string,
    documentName: string,
    fileUrl: string,
  ): AssetDocumentBuilder {
    return new AssetDocumentBuilder(
      id,
      assetId,
      organizationId,
      documentName,
      fileUrl,
    );
  }

  public static createFromBuilder(
    builder: AssetDocumentBuilder,
  ): AssetDocument {
    return new AssetDocument(builder);
  }
}

export class AssetDocumentBuilder {
  public readonly id: string;
  public readonly assetId: string;
  public readonly organizationId: string;
  public documentName: string;
  public fileUrl: string;
  public documentType: string = 'OTHER';
  public fileKey: string | null = null;
  public fileSize: number | null = null;
  public mimeType: string | null = null;
  public uploadedAt: Date = new Date();

  constructor(
    id: string,
    assetId: string,
    organizationId: string,
    documentName: string,
    fileUrl: string,
  ) {
    this.id = id;
    this.assetId = assetId;
    this.organizationId = organizationId;
    this.documentName = documentName;
    this.fileUrl = fileUrl;
  }

  public withFileInfo(
    key: string | null,
    size: number | null,
    mime: string | null,
  ): this {
    this.fileKey = key;
    this.fileSize = size;
    this.mimeType = mime;
    return this;
  }

  public ofType(type: string): this {
    this.documentType = type;
    return this;
  }

  public build(): AssetDocument {
    this.validate();
    return AssetDocument.createFromBuilder(this);
  }

  private validate(): void {
    if (!this.id || !this.assetId || !this.organizationId) {
      throw new BusinessRuleViolationException(
        'DOCUMENT_REQUIRED_IDS',
        'ID, Asset ID, and Organization ID are mandatory.',
      );
    }
    if (!this.fileUrl || !this.fileUrl.startsWith('http')) {
      throw new BusinessRuleViolationException(
        'INVALID_FILE_URL',
        'A valid file URL is required.',
      );
    }
    if (!this.documentName || this.documentName.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'DOCUMENT_NAME_INVALID',
        'Document name cannot be empty.',
      );
    }
  }
}
