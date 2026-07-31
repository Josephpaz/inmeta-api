import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from 'src/shared/core/domain-exception';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    response.status(exception.status).json({
      statusCode: exception.status,
      error: exception.name,
      message: exception.message,
    });
  }
}
