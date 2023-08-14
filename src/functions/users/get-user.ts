import { Exception, HttpTools } from '../../utils';
import { APIGatewayProxyEvent } from 'aws-lambda';
import UserController from '../../controllers/users';

const controller = new UserController();

export async function handle(event: APIGatewayProxyEvent) {
  try {
    const user = await controller.getUserById(event.pathParameters.id);

    return HttpTools.buildResponse(200, user);
  } catch (error) {
    if (error instanceof Exception)
      return HttpTools.buildResponse(error.statusCode, error);
    return HttpTools.buildResponse(500, 'Something went wrong. Try again later.');
  }
}
