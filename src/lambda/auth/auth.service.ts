import User from '../../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Exception } from '../../helpers';

type UserFields = {
  name: string;
  email: string;
  password: string;
};

const TOKEN_EXPIRATION_TIME_IN_HOURS = process.env.TOKEN_EXPIRATION_TIME_IN_HOURS || 24;

export default class AuthService {
  async login(credentials: Omit<UserFields, 'name'>) {
    const user = await User.getByEmail(credentials.email);
    if (!user) throw new Exception({ message: 'Invalid email', statusCode: 401 });

    await this.comparePassword(credentials.password, user.password);

    return this.signToken(user.userId);
  }

  async register(data: UserFields) {
    try {
      const input = await this.validateRegister(data);
      const { attrs: user } = await User.create(input);

      delete user.password;
      return user;
    } catch (error) {
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

  private async validateRegister(eventBody: UserFields) {
    const existingUser = await User.getByEmail(eventBody.email);
    if (existingUser) throw new Error('Field email must be unique');

    return {
      ...eventBody,
      password: this.toHashPassword(eventBody.password),
    };
  }

  private signToken(userId: string) {
    const expiresIn = Number(TOKEN_EXPIRATION_TIME_IN_HOURS) * 3600;

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
