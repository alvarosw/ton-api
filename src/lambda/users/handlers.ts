import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { badResponse, response } from '../../utils';
import { GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import db from '../../db';

const DB_PARAMS = { TableName: process.env.USERS_TABLE };

export async function getUser(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const params = { ...DB_PARAMS, Key: marshall({ userId: event.pathParameters.userId }) };
    const { Item } = await db.send(new GetItemCommand(params));

    return response(200, unmarshall(Item || {}));
  } catch (e) {
    return badResponse(500, 'Failed to get user');
  }
}

export async function createUser(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const data = JSON.parse(event.body);
    const params = { ...DB_PARAMS, Item: marshall(data || {}) };
    const createResult = await db.send(new PutItemCommand(params));

    return response(200, createResult);
  } catch (e) {
    return badResponse(500, 'Failed to create user');
  }
}
