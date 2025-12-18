import { DomainException } from './base/domain.exception';

export class EntityAlreadyExistsException extends DomainException {
  constructor(
    entityName: string,
    field: string,
    value: any,
    additionalDetails?: Record<string, any>,
  ) {
    const message = `${entityName} with ${field} '${value}' already exists`;

    super(
      message,
      'DOMAIN-003', // Error code cho duplicate
      {
        entityName,
        field,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        value,
        suggestion: `Please use a different ${field}`,
        ...additionalDetails,
      },
    );
  }
}
