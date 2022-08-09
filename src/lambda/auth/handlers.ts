import User from '../users/User';
import bcrypt from 'bcrypt';
import { badResponse, response } from '../../utils';
import { APIGatewayEvent } from 'aws-lambda';

type UserInterface = {
  userid: string;
  name: string;
  email: string;
  password: string;
};

export async function register(event: APIGatewayEvent) {
  try {
    const input = await validateRegister(JSON.parse(event.body));
    const { attrs: user } = await User.create(input);

    delete user.password;

    return response(200, user);
  } catch (error) {
    return badResponse(400, error.message);
  }
}

/**
 * Helpers
 */
async function validateRegister(eventBody: Omit<UserInterface, 'userId'>) {
  const [existingUserScan] = await User.scan().where('email').equals(eventBody.email).exec().promise();

  if (existingUserScan?.Items?.length) throw new Error('Field email must be unique');

  return {
    ...eventBody,
    password: toHashPassword(eventBody.password),
  };
}

function toHashPassword(password: string) {
  const saltOrRounds = 8;
  return bcrypt.hashSync(password, saltOrRounds);
}
