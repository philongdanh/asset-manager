import { ApplicationException, ErrorType } from './base/application.exception';
import { HttpStatus } from '@nestjs/common';

export class UseCaseException extends ApplicationException {
  constructor(
    message: string,
    public readonly useCaseName: string,
    details?: Record<string, any>,
  ) {
    super(
      `Use case '${useCaseName}' failed: ${message}`,
      ErrorType.BUSINESS,
      HttpStatus.BAD_REQUEST,
    );
    this.details = details || {};
  }

  private details: Record<string, any>;

  toJSON() {
    return {
      ...super.toJSON(),
      useCaseName: this.useCaseName,
      details: this.details,
    };
  }
}
