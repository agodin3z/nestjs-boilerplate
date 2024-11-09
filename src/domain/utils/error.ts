// import 'dotenv/config';

// import { Logtail } from '@logtail/node';
import { Logger } from '@nestjs/common';
import { AxiosError } from 'axios';

// const KEY = process.env.LOGTAIL_KEY || '';
// const logtail = new Logtail(KEY);

interface ErrorMsg {
  [key: number]: string;
}

export const httpErrorMsg: ErrorMsg = {
  200: 'The server successfully returned the requested data. ',
  201: 'Create or modify data successfully. ',
  202: 'A request has entered the background queue (asynchronous task). ',
  204: 'Delete data successfully. ',
  400: 'There was an error in the request sent, and the server did not create or modify data. ',
  401: 'The user does not have permission, please try to login again. ',
  403: 'The user is authorized, but access is forbidden. ',
  404: 'The request sent is for a record that does not exist, and the server is not operating. ',
  406: 'The requested format is not available. ',
  410: 'The requested resource has been permanently deleted and will no longer be available. ',
  422: 'When creating an object, a validation error occurred. ',
  500: 'An error occurred in the server, please check the server. ',
  502: 'Gateway error. ',
  503: 'The service is unavailable, the server is temporarily overloaded or maintained. ',
  504: 'The gateway has timed out. ',
};

// Uncomment to send errors to Logtail or Sentry
/* const logtailSubmit = (e: any, message?: string, status?: any): void => {
  if (!KEY) return;
  try {
    const isAxiosError = e?.isAxiosError || false;
    const hasErrorData = Boolean(e?.data);

    const details = {
      type: typeof e,
      string: e.toString(),
      message: e?.message || message,
      status,
      name: e?.name,
      stack: e?.stack,
      axios: isAxiosError
        ? {
            status: e.response?.status,
            config: JSON.stringify(
              e.response?.config,
              Object.getOwnPropertyNames(e.response?.config),
            ),
            data: JSON.stringify(e.response?.data, Object.getOwnPropertyNames(e.response?.data)),
            headers: JSON.stringify(
              e.response?.headers,
              Object.getOwnPropertyNames(e.response?.headers),
            ),
          }
        : undefined,
      data: hasErrorData ? JSON.stringify(e?.data) : undefined,
      raw: JSON.stringify(e, Object.getOwnPropertyNames(e)),
    };

    logtail.error(message, { details });
    logtail.flush();
  } catch {
    // nothing to do
  }
}; */

/**
 * Handles an error and returns an object with status and result.
 * @param {any} err The error to handle.
 * @param {Logger} logger The logger to log the error.
 * @param {string} [msg] The message to display for the error.
 * @returns {{status: number, result: {success: boolean, message: string}}}
 */
export const handleError = (
  err: any,
  logger: Logger,
  msg?: string,
): {
  status: number;
  result: {
    success: boolean;
    message: string;
  };
} => {
  let status = 400;
  let message = httpErrorMsg[status];
  let errObj: any;

  try {
    if (err.response?.status || err instanceof AxiosError) {
      status = err.response?.status || 500;
      message = err.response?.data?.message || err.message || 'Axios request error';
    } else if (typeof err.statusCode === 'number') {
      status = err.statusCode;
      message = err.message || 'Error with status code';
    } else if (err instanceof Error) {
      status = !err.message ? 500 : 400;
      message = err.message || 'Internal Server Error';
    }
    errObj = err;
  } catch (error) {
    status = 500;
    message = 'Internal Server Error';
    errObj = error;
  } finally {
    logger.error(errObj);
    // logtailSubmit(errObj, msg || message, status);
    return { status, result: { success: false, message: msg || message } };
  }
};
