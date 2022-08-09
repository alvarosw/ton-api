import { APIGatewayProxyEvent } from 'aws-lambda';

type EventProps = {
  httpMethod: 'get' | 'post' | 'put' | 'delete';
  path: string;
  body?: object;
  headers?: object;
  isBase64Encoded?: boolean;
  multiValueHeaders?: object;
  multiValueQueryStringParameters?: object;
  pathParameters?: object;
  queryStringParameters?: object;
};

export function request(data: EventProps) {
  return Object.assign(
    {
      ...data,
      body: data.body ? JSON.stringify(data.body) : '',
    },
    {
      headers: {},
      isBase64Encoded: false,
      multiValueHeaders: {},
      multiValueQueryStringParameters: {},
      pathParameters: {},
      queryStringParameters: {},
    },
  ) as APIGatewayProxyEvent;
}
