import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class HttpLogger implements NestMiddleware {
  private logger = new Logger('HTTP');
  use(req: Request, res: Response, next: NextFunction): void {
    const now = Date.now();
    res.on('finish', () => {
      const delay = Date.now() - now;
      const { ip, method, originalUrl, hostname, headers, body } = req;
      const { statusCode, statusMessage } = res;
      const message = `${
        headers['x-forwarded-for'] ?? ip
      } - ${method} ${originalUrl} - ${statusCode}: ${statusMessage} - ${hostname} - Origin: ${
        headers['origin']
      } "${headers['user-agent']}" - Body: ${JSON.stringify(body)} - Took: ${delay}ms`;
      if (statusCode >= 500) {
        return this.logger.error(message);
      }
      if (statusCode >= 400) {
        return this.logger.warn(message);
      }
      return this.logger.log(message);
    });
    next();
  }
}
