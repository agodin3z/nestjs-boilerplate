import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HelloQuery } from '../hello.query';
import { AppService } from '@domain/services/app.service';

@QueryHandler(HelloQuery)
export class HelloHandler implements IQueryHandler<HelloQuery> {
  private logger: Logger;
  constructor(private service: AppService) {
    this.logger = new Logger(HelloHandler.name);
  }

  async execute(): Promise<string> {
    try {
      return this.service.getHello();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
