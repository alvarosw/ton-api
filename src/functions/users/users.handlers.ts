import { Response } from '../../helpers';
import { APIGatewayProxyEvent } from 'aws-lambda';
import UsersService from './users.service';

const userSvc = new UsersService();

export async function getUser(event: APIGatewayProxyEvent) {
  try {
    const user = await userSvc.getUserById(event.pathParameters.userId);

    return Response.ok(200, user);
  } catch (error) {
    return Response.error(error);
  }
}
