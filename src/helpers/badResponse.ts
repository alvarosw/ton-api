import { APIGatewayProxyResult } from 'aws-lambda';

export function badResponse(statusCode: number, message?: string) {
  return {
    statusCode,
    body: JSON.stringify({
      message: message || 'Something went wrong',
    }),
  } as APIGatewayProxyResult;
}
