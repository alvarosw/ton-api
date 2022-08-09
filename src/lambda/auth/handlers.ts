import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../users/User';
import { APIGatewayEvent } from 'aws-lambda';
import { badResponse, response } from '../../utils';

type UserInterface = {
  userId: string;
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
async function getUserByEmail(email: string) {
  const [scan] = await User.scan().where('email').equals(email).exec().promise();

  return (scan.Items[0]?.attrs as UserInterface) || null;
}

async function validateRegister(eventBody: Omit<UserInterface, 'userId'>) {
  const existingUser = getUserByEmail(eventBody.email);
  if (existingUser) throw new Error('Field email must be unique');

  return {
    ...eventBody,
    password: toHashPassword(eventBody.password),
  };
}

function toHashPassword(password: string) {
  const saltOrRounds = 8;
  return bcrypt.hashSync(password, saltOrRounds);
}
