import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error: string | null = null;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      error = exception.getResponse()?.['message'] ?? null;
    }

    const errorResponse = {
      code: status,
      timestamp: new Date().toLocaleDateString(),
      path: request.url,
      method: request.method,
      exception,
      message: exception?.message || null,
      error: error || exception?.cause || null,
    };

    this.logger.error(JSON.stringify(errorResponse, Object.getOwnPropertyNames(errorResponse)));

    response.status(status).json({
      success: false,
      message: errorResponse.error,
    });
  }
}
