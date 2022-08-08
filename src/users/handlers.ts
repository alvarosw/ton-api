import { GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { response } from '../utils';
import db from '../db';

const DB_PARAMS = { TableName: process.env.USERS_TABLE };

export async function getUser(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const params = { ...DB_PARAMS, Key: marshall({ userId: event.pathParameters.userId }) };
    const { Item } = await db.send(new GetItemCommand(params));

    return response(200, {
      message: 'Successfully retrieved user.',
      data: Item ? unmarshall(Item) : {},
      rawData: Item,
    });
  } catch (e) {
    return response(500, {
      message: 'Failed to get user.',
      errorMsg: (<any>e).message,
      errorStack: (<any>e).stack,
    });
  }
}

export async function createUser(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const data = JSON.parse(event.body);
    const params = { ...DB_PARAMS, Item: marshall(data || {}) };
    const createResult = await db.send(new PutItemCommand(params));

    return response(200, {
      message: 'Successfully created user.',
      createResult,
    });
  } catch (e) {
    return response(500, {
      message: 'Failed to create user.',
      errorMsg: (<any>e).message,
      errorStack: (<any>e).stack,
    });
  }
}
