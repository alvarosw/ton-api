import { badResponse, response } from '../../helpers';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import User from '../../models/user';

export async function getUser(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const { attrs: user } = await User.get(event.pathParameters.userId);
    delete user.password;

    return response(200, user);
  } catch (e) {
    return badResponse(500, 'Failed to get user');
  }
}
