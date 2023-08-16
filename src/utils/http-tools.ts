import { APIGatewayProxyResult } from 'aws-lambda';
import { Exception } from './exception';

export namespace HttpTools {
  export function JSONTryParse<T>(data: string): T {
    try {
      if (data) {
        return JSON.parse(data);
      }
      return {} as T;
    } catch (error) {
      throw new Exception({
        message: 'Invalid JSON body provided.',
        statusCode: 400,
      });
    }
  }

  export function buildResponse(statusCode: number, data?: object | string) {
    const body = data ? (typeof data !== 'object' ? { message: data } : data) : null;

    return {
      statusCode,
      body: body ? JSON.stringify(body) : '',
    } as APIGatewayProxyResult;
  }
}
