import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class DomainFilterMiddleware implements NestMiddleware {
  private readonly allowedDomains: string[];

  constructor(private readonly configService: ConfigService) {
    const urls = this.configService.get<string>('ALLOWED_DOMAINS')?.split(',');
    this.allowedDomains = Array.isArray(urls) ? urls : [urls];
  }

  use(req: Request, _res: any, next: () => void): void {
    const origin = req.headers.origin?.replace('https://', '')?.replace('http://', '');

    if (this.configService.get('NODE_ENV') !== 'test' && !this.allowedDomains.includes(origin)) {
      throw new ForbiddenException({
        message: 'Cannot make requests to this route',
      });
    }

    next();
  }
}
