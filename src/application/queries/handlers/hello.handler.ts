import { HttpStatus, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';

import { AppService } from '@domain/services/app.service';
import { handleError } from '@domain/utils/error';
import { InnerResponseDto, ResponseDto } from '@interface/dtos/response.dto';
import { HelloQuery } from '../hello.query';

@QueryHandler(HelloQuery)
export class HelloHandler implements IQueryHandler<HelloQuery> {
  private logger: Logger;
  constructor(private service: AppService) {
    this.logger = new Logger(HelloHandler.name);
  }

  async execute(): Promise<InnerResponseDto> {
    try {
      const message = this.service.getHello();
      return {
        status: HttpStatus.OK,
        result: plainToInstance(
          ResponseDto,
          {
            success: true,
            message,
          },
          { excludeExtraneousValues: true },
        ),
      };
    } catch (error) {
      return handleError(error, this.logger);
    }
  }
}
