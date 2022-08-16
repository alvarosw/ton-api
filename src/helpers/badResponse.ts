import { APIGatewayProxyResult } from 'aws-lambda';
import { Exception } from './exception';

export function badResponse(error: Exception | Error) {
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
