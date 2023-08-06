import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import errorLoggerMiddleware from '@middy/error-logger';
import httpErrorHandler from '@middy/http-error-handler';
import eventNormalizerMiddleware from '@middy/event-normalizer';
import cors from '@middy/http-cors';
import {getFunctionLogger} from './logger';
import {formatJSONResponse} from './api-gateway';

export const logger = getFunctionLogger({fileName: __filename});

export const middyfy = (handler) => {
  const wrapped = async (e) => {
    try {
      return await handler(e);
    } catch (err) {
      logger.error({err}, 'Fatal error')
      return formatJSONResponse(500, {
        stack: err.stack, message: err.message, timestamp: new Date(Date.now()).toISOString()
      })
    }
  };

  return middy(wrapped)
    .use(httpHeaderNormalizer())
    .use(eventNormalizerMiddleware())
    .use(middyJsonBodyParser())
    .use(errorLoggerMiddleware())
    .use(httpErrorHandler({logger: true, fallbackMessage: 'Something went wrong'}))
    .use(cors({
      disableBeforePreflightResponse: true,
      credentials: true,
      methods: '*',
      headers: '*',
      requestMethods: '*',
      requestHeaders: '*'
    }));
};

