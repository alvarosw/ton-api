import { APIGatewayProxyResult } from 'aws-lambda';
import { Exception } from './exception';

export class Response {
  static ok(statusCode: number, body?: object) {
    return {
      statusCode,
      body: body ? JSON.stringify(body) : '',
    } as APIGatewayProxyResult;
  }

  static error(error: Exception | Error) {
    if (!(error instanceof Exception)) {
      error = new Exception({
        internalErrorMessage: error.message,
      });
    }

    return {
      statusCode: (error as Exception).statusCode,
      body: JSON.stringify(error),
    } as APIGatewayProxyResult;
  }
}
