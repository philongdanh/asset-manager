import { ApplicationException, ErrorType } from './base/application.exception';
import { HttpStatus } from '@nestjs/common';

export class ValidationError {
  constructor(
    public readonly field: string,
    public readonly message: string,
    public readonly rejectedValue?: any,
  ) {}
}

export class CommandValidationException extends ApplicationException {
  constructor(
    public readonly validationErrors: ValidationError[],
    commandName?: string,
  ) {
    const message = commandName
      ? `Validation failed for command '${commandName}'`
      : 'Command validation failed';

    super(message, ErrorType.VALIDATION, HttpStatus.UNPROCESSABLE_ENTITY);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      validationErrors: this.validationErrors,
    };
  }
}
