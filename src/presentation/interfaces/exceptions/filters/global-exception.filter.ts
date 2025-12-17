import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApplicationException } from 'src/application/exceptions/base/application.exception';
import { DomainException } from 'src/domain/exceptions';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus;
    let errorResponse: any;

    // Handle Domain Exceptions
    if (exception instanceof DomainException) {
      status = HttpStatus.BAD_REQUEST;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      errorResponse = this.formatDomainException(exception, request);
    }
    // Handle Application Exceptions
    else if (exception instanceof ApplicationException) {
      status = exception.httpStatus;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      errorResponse = this.formatApplicationException(exception, request);
    }
    // Handle NestJS HttpExceptions
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      errorResponse = this.formatHttpException(exception, request);
    }
    // Handle all other errors
    else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      errorResponse = this.formatUnknownError(exception, request);
    }

    // Log error
    this.logError(exception, request);

    // Send response
    response.status(status).json(errorResponse);
  }

  private formatDomainException(
    exception: DomainException,
    request: Request,
  ): any {
    return {
      success: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      errorType: 'DOMAIN_ERROR',
      errorCode: exception.errorCode,
      message: exception.message,
      details: exception.details,
    };
  }

  private formatApplicationException(
    exception: ApplicationException,
    request: Request,
  ): any {
    return {
      success: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      errorType: exception.errorType,
      message: exception.message,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ...((exception as any).validationErrors && {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        validationErrors: (exception as any).validationErrors,
      }),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ...((exception as any).details && {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        details: (exception as any).details,
      }),
    };
  }

  private formatHttpException(exception: HttpException, request: Request): any {
    const response = exception.getResponse();

    return {
      success: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      errorType: 'HTTP_ERROR',
      statusCode: exception.getStatus(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      message:
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        typeof response === 'string' ? response : (response as any).message,
      ...(typeof response === 'object' && response),
    };
  }

  private formatUnknownError(error: unknown, request: Request): any {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
      success: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      errorType: 'INTERNAL_ERROR',
      message: isProduction
        ? 'Internal server error'
        : (error as Error)?.message || 'Unknown error',
      ...(!isProduction && {
        stack: (error as Error)?.stack,
        rawError: error,
      }),
    };
  }

  private logError(error: unknown, request: Request): void {
    const message = `Exception: ${(error as Error)?.message || 'Unknown error'}`;
    const context = {
      url: request.url,
      method: request.method,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      body: request.body,
      params: request.params,
      query: request.query,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      user: (request as any).user,
    };

    if (
      error instanceof DomainException ||
      error instanceof ApplicationException
    ) {
      this.logger.warn(message, context);
    } else if (error instanceof HttpException && error.getStatus() < 500) {
      this.logger.warn(message, context);
    } else {
      this.logger.error(message, (error as Error)?.stack, context);
    }
  }
}
