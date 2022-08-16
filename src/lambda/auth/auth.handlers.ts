import { APIGatewayEvent } from 'aws-lambda';
import { badResponse, response } from '../../helpers';
import AuthService from './auth.service';

const authSvc = new AuthService();

export async function login(event: APIGatewayEvent) {
  try {
    const res = await authSvc.login(JSON.parse(event.body));

    return response(200, res);
  } catch (error) {
    return badResponse(error);
  }
}

export async function register(event: APIGatewayEvent) {
  try {
    const res = await authSvc.register(JSON.parse(event.body));

    return response(201, res);
  } catch (error) {
    return badResponse(error);
  }
}
