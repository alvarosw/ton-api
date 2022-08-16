import { badResponse, response } from '../../helpers';
import { APIGatewayProxyEvent } from 'aws-lambda';
import UsersService from './users.service';

const userSvc = new UsersService();

export async function getUser(event: APIGatewayProxyEvent) {
  try {
    const user = await userSvc.getUserById(event.pathParameters.userId);

    return response(200, user);
  } catch (error) {
    return badResponse(error);
  }
}
