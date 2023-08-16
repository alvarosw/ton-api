import UserRepository from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Exception } from '../utils';
import { PostUser } from 'src/types/user';
import { UserCredentials } from 'src/types/auth';

const TOKEN_EXPIRATION_HOURS = process.env.TOKEN_EXPIRATION_HOURS || 24;

export default class AuthController {
  async login(credentials: UserCredentials) {
    const user = await UserRepository.getByEmail(credentials.email);
    if (!user) throw new Exception({ message: 'Invalid email', statusCode: 401 });

    await this.comparePassword(credentials.password, user.password);

    return this.signToken(user.id);
  }

  async register(data: PostUser) {
    try {
      const input = await this.validateRegister(data);
      const { attrs: user } = await UserRepository.create(input);

      delete user.password;
      return user;
    } catch (error) {
      if (error instanceof Exception)
        throw error
      if (error.message.startsWith('Field'))
        throw new Exception({
          message: error.message,
          statusCode: 400,
        });
      throw error;
    }
  }

  private async comparePassword(inputPassword: string, userPassword: string) {
    const passwordMatches = await bcrypt.compare(inputPassword, userPassword);
    if (!passwordMatches)
      throw new Exception({
        message: 'Invalid password',
        statusCode: 401,
      });

    return true;
  }

  private async validateRegister(eventBody: PostUser) {
    const existingUser = await UserRepository.getByEmail(eventBody.email);
    if (existingUser)
      throw new Exception({
        message: 'The email provided is already in use!',
        statusCode: 409
      });

    return {
      ...eventBody,
      password: this.toHashPassword(eventBody.password),
    };
  }

  private signToken(userId: string) {
    const expiresIn = Number(TOKEN_EXPIRATION_HOURS) * 3600;

    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn,
    });

    return { token, expiresIn };
  }

  private toHashPassword(password: string) {
    const saltOrRounds = 8;
    return bcrypt.hashSync(password, saltOrRounds);
  }
}
