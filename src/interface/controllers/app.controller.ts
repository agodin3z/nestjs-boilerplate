import { HelloQuery } from '@application/queries/hello.query';
import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Index')
@Controller()
export class AppController {
  constructor(private readonly _queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: 'Say hello' })
  getHello(): Promise<string> {
    const query = new HelloQuery();
    return this._queryBus.execute(query);
  }
}
