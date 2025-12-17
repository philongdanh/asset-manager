import { HttpStatus } from '@nestjs/common';

export enum ErrorType {
  VALIDATION = 'VALIDATION',
  BUSINESS = 'BUSINESS',
  TECHNICAL = 'TECHNICAL',
  SECURITY = 'SECURITY',
}

export abstract class ApplicationException extends Error {
  public readonly errorType: ErrorType;
  public readonly httpStatus: HttpStatus;
  public readonly timestamp: Date;

  constructor(
    message: string,
    errorType: ErrorType = ErrorType.BUSINESS,
    httpStatus: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.errorType = errorType;
    this.httpStatus = httpStatus;
    this.timestamp = new Date();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApplicationException);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      errorType: this.errorType,
      httpStatus: this.httpStatus,
      timestamp: this.timestamp.toISOString(),
    };
  }
}
