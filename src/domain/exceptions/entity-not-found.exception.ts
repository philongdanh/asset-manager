import { DomainException } from './base/domain.exception';

export class EntityNotFoundException extends DomainException {
  constructor(
    entityName: string,
    entityId: string,
    details?: Record<string, any>,
  ) {
    const message = `${entityName} with ID ${entityId} not found`;
    super(message, 'DOMAIN-001', {
      entityName,
      entityId,
      ...details,
    });
  }
}
