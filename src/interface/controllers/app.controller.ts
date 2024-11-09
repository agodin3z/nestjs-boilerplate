import { AppService } from '@domain/services/app.service';
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Status')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Say hello' })
  getHello(): string {
    return this.appService.getHello();
  }
}
