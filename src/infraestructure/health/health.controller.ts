import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
  HttpHealthIndicator,
} from '@nestjs/terminus';

const localhost = 'http://localhost';

@ApiTags('Status')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private config: ConfigService,
    private http: HttpHealthIndicator,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Check health status' })
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    const port = this.config.get<number>('PORT') || 3000;
    return await this.health.check([
      async (): Promise<HealthIndicatorResult> =>
        await this.http.pingCheck('api', `${localhost}:${port}/v1`, {
          headers: {
            Origin: `${localhost}:${port}`,
          },
        }),
    ]);
  }
}
