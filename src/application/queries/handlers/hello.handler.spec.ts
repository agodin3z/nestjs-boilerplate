import { AppService } from '@domain/services/app.service';
import { InnerResponseDto } from '@interface/dtos/response.dto';
import { HttpStatus, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { HelloHandler } from './hello.handler';

describe('HelloHandler', () => {
  let handler: HelloHandler;
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HelloHandler,
        {
          provide: AppService,
          useValue: { getHello: jest.fn() },
        },
      ],
    }).compile();

    handler = module.get<HelloHandler>(HelloHandler);
    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should return a successful InnerResponseDto with "Hello World!" message', async () => {
    const mockMessage = 'Hello World!';
    jest.spyOn(service, 'getHello').mockReturnValue(mockMessage);

    const result = await handler.execute();

    expect(result).toEqual({
      status: HttpStatus.OK,
      result: expect.objectContaining({
        success: true,
        message: mockMessage,
      }),
    });
  });

  it('should call handleError when an error is thrown', async () => {
    const error = new Error('Something went wrong');
    const logger = new Logger(HelloHandler.name);
    const handleErrorSpy = jest
      .spyOn(require('@domain/utils/error'), 'handleError')
      .mockReturnValue({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        result: expect.objectContaining({
          success: false,
          message: 'Something went wrong',
        }),
      } as InnerResponseDto);

    jest.spyOn(service, 'getHello').mockImplementation(() => {
      throw error;
    });

    const result = await handler.execute();

    expect(handleErrorSpy).toHaveBeenCalledWith(error, logger);
    expect(result.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});
