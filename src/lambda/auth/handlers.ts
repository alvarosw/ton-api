import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/user';
import { APIGatewayEvent } from 'aws-lambda';
import { badResponse, response } from '../../helpers';

type UserInterface = {
  userId: string;
  name: string;
  email: string;
  password: string;
};

const TOKEN_EXPIRATION_TIME_IN_HOURS = process.env.TOKEN_EXPIRATION_TIME_IN_HOURS || 24;

export async function login(event: APIGatewayEvent) {
  return tryLogin(JSON.parse(event.body))
    .then((token) => response(200, token))
    .catch((error) => badResponse(401, error.message));
}

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
async function tryLogin(credentials: { email: string; password: string }) {
  const user = await User.getByEmail(credentials.email);
  if (!user) throw new Error('Invalid email');

  const token = await comparePassword({
    inputPassword: credentials.password,
    userPassword: user.password,
    userId: user.userId,
  });

  return { token };
}

async function comparePassword({ inputPassword, userPassword, userId }: Record<string, string>) {
  const passwordMatches = await bcrypt.compare(inputPassword, userPassword);
  if (!passwordMatches) throw new Error('Invalid password');

  return signToken(userId);
}

function signToken(userId: string) {
  const tokenExpirationTimeInSeconds = Number(TOKEN_EXPIRATION_TIME_IN_HOURS) * 3600;

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: tokenExpirationTimeInSeconds,
  });
}

async function validateRegister(eventBody: Omit<UserInterface, 'userId'>) {
  const existingUser = await User.getByEmail(eventBody.email);
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
