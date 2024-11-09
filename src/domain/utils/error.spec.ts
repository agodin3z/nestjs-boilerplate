import { Logger } from '@nestjs/common';
import { AxiosError } from 'axios';

import { handleError } from './error';

describe('handleError', () => {
  let logger: Logger;
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new Logger('TestLogger');
    loggerSpy = jest.spyOn(logger, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle an Axios error', () => {
    const axiosError = new AxiosError('Axios request failed');
    axiosError.response = {
      status: 404,
      data: { message: 'Resource not found' },
    } as any;

    const result = handleError(axiosError, logger);

    expect(loggerSpy).toHaveBeenCalledWith(axiosError);
    expect(result).toEqual({
      status: 404,
      result: {
        success: false,
        message: 'Resource not found',
      },
    });
  });

  it('should handle an Axios error without data', () => {
    const axiosError = new AxiosError();

    const result = handleError(axiosError, logger);

    expect(loggerSpy).toHaveBeenCalledWith(axiosError);
    expect(result).toEqual({
      status: 500,
      result: {
        success: false,
        message: 'Axios request error',
      },
    });
  });

  it('should handle error with statusCode property', () => {
    const customError = {
      statusCode: 403,
      message: 'Forbidden access',
    };

    const result = handleError(customError, logger);

    expect(loggerSpy).toHaveBeenCalledWith(customError);
    expect(result).toEqual({
      status: 403,
      result: {
        success: false,
        message: 'Forbidden access',
      },
    });
  });

  it('should handle error with statusCode property but without message', () => {
    const customError = {
      statusCode: 403,
    };

    const result = handleError(customError, logger);

    expect(loggerSpy).toHaveBeenCalledWith(customError);
    expect(result).toEqual({
      status: 403,
      result: {
        success: false,
        message: 'Error with status code',
      },
    });
  });

  it('should handle generic Error with message', () => {
    const error = new Error('Generic error');

    const result = handleError(error, logger);

    expect(loggerSpy).toHaveBeenCalledWith(error);
    expect(result).toEqual({
      status: 400,
      result: {
        success: false,
        message: 'Generic error',
      },
    });
  });

  it('should handle generic Error without message', () => {
    const error = new Error();

    const result = handleError(error, logger);

    expect(loggerSpy).toHaveBeenCalledWith(error);
    expect(result).toEqual({
      status: 500,
      result: {
        success: false,
        message: 'Internal Server Error',
      },
    });
  });

  it('should handle an unexpected error in the catch block', () => {
    const invalidError = null as any;

    const result = handleError(invalidError, logger);

    expect(loggerSpy).toHaveBeenCalled();
    expect(result).toEqual({
      status: 500,
      result: {
        success: false,
        message: 'Internal Server Error',
      },
    });
  });

  it('should override the default message when msg is provided', () => {
    const error = new Error('Original error');
    const customMessage = 'Custom error message';

    const result = handleError(error, logger, customMessage);

    expect(loggerSpy).toHaveBeenCalledWith(error);
    expect(result).toEqual({
      status: 400,
      result: {
        success: false,
        message: customMessage,
      },
    });
  });
});
