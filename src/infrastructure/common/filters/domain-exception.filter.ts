export abstract class DomainException extends Error {
  public readonly errorCode: string;
  public readonly details: Record<string, any>;

  constructor(
    message: string,
    errorCode: string,
    details?: Record<string, any>,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.errorCode = errorCode;
    this.details = details || {};

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DomainException);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      errorCode: this.errorCode,
      details: this.details,
    };
  }
}
