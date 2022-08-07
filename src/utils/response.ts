import { APIGatewayProxyResult } from 'aws-lambda';

export function response(statusCode: number, body?: object) {
    return {
        statusCode,
        body: body ? JSON.stringify(body) : '',
    } as APIGatewayProxyResult;
}
