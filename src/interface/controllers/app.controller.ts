import { HelloQuery } from '@application/queries/hello.query';
import { InnerResponseDto, ResponseDto } from '@interface/dtos/response.dto';
import { Controller, Get, Res } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';

@ApiTags('Index')
@Controller()
export class AppController {
  constructor(private readonly _queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: 'Say hello' })
  @ApiOkResponse({ status: 200, type: ResponseDto })
  async getHello(@Res({ passthrough: true }) res: Response): Promise<ResponseDto> {
    const query = new HelloQuery();
    const response = await this._queryBus.execute<HelloQuery, InnerResponseDto>(query);
    res.status(response.status);
    return plainToInstance(ResponseDto, response.result);
  }
}
