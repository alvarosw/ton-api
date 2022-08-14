import { badResponse, response } from '../../helpers';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import UserService from './user.service';

const userSvc = new UserService();

export async function getUser(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const user = await userSvc.getUserById(event.pathParameters.userId);

    return response(200, user);
  } catch (error) {
    return badResponse(error);
  }
}
