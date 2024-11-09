import { ConfigService } from '@nestjs/config';
import {
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorFunction,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { HealthController } from './health.controller';

describe('HealthController', () => {
  let healthController: HealthController;
  let configService: ConfigService;
  let healthCheckService: HealthCheckService;
  let httpHealthIndicator: HttpHealthIndicator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: {
            check: jest.fn((indicators: HealthIndicatorFunction[]) => {
              return Promise.all(indicators.map((indicator) => indicator())).then((results) => ({
                status: 'ok',
                info: { api: results[0] },
                error: {},
                details: { api: results[0] },
              }));
            }),
          },
        },
        {
          provide: HttpHealthIndicator,
          useValue: {
            pingCheck: jest.fn().mockReturnValue(Promise.resolve({ status: 'up' })),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(3000),
          },
        },
      ],
    }).compile();

    healthController = module.get<HealthController>(HealthController);
    configService = module.get<ConfigService>(ConfigService);
    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
    httpHealthIndicator = module.get<HttpHealthIndicator>(HttpHealthIndicator);
  });

  it('should be defined', () => {
    expect(healthController).toBeDefined();
  });

  it('should return health check result', async () => {
    const mockHealthResult: HealthCheckResult = {
      status: 'ok',
      info: { api: { status: 'up' } },
      error: {},
      details: { api: { status: 'up' } },
    };

    jest.spyOn(healthCheckService, 'check');
    jest.spyOn(httpHealthIndicator, 'pingCheck');

    const result = await healthController.check();
    expect(result).toEqual(mockHealthResult);
    expect(configService.get).toHaveBeenCalledWith('PORT');
    expect(healthCheckService.check).toHaveBeenCalled();
    expect(httpHealthIndicator.pingCheck).toHaveBeenCalledWith('api', 'http://localhost:3000/v1', {
      headers: { Origin: 'http://localhost:3000' },
    });
  });

  it('should use default port if PORT is not defined', async () => {
    const mockHealthResult: HealthCheckResult = {
      status: 'ok',
      info: { api: { status: 'up' } },
      error: {},
      details: { api: { status: 'up' } },
    };

    jest.spyOn(configService, 'get').mockReturnValue(undefined);
    jest.spyOn(healthCheckService, 'check');
    jest
      .spyOn(httpHealthIndicator, 'pingCheck')
      .mockReturnValue(of(mockHealthResult.details.api) as any);

    const result = await healthController.check();
    expect(result.status).toEqual('ok');
    expect(configService.get).toHaveBeenCalledWith('PORT');
    expect(healthCheckService.check).toHaveBeenCalled();
    expect(httpHealthIndicator.pingCheck).toHaveBeenCalledWith('api', 'http://localhost:3000/v1', {
      headers: { Origin: 'http://localhost:3000' },
    });
  });
});
