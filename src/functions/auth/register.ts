import { APIGatewayEvent } from 'aws-lambda';
import { Exception, HttpTools } from '../../utils';
import AuthController from '../../controllers/auth-config';

const controller = new AuthController();

export async function handle(event: APIGatewayEvent) {
  try {
    const res = await controller.register(JSON.parse(event.body));

    return HttpTools.buildResponse(201, res);
  } catch (error) {
    if (error instanceof Exception)
      return HttpTools.buildResponse(error.statusCode, error);
    return HttpTools.buildResponse(500, 'Something went wrong. Try again later.');
  }
}
