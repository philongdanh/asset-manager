import { DomainException } from './base/domain.exception';

export class BusinessRuleViolationException extends DomainException {
  constructor(
    ruleName: string,
    violationDetails: string,
    details?: Record<string, any>,
  ) {
    const message = `Business rule '${ruleName}' violated: ${violationDetails}`;
    super(message, 'DOMAIN-002', {
      ruleName,
      violationDetails,
      ...details,
    });
  }
}
