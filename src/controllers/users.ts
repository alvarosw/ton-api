import { Exception } from '../utils';
import User from '../models/user';

export default class UserController {
  async getUserById(id: string) {
    const user = await User.getById(id);
    if (!user) throw new Exception({ message: 'User not found', statusCode: 404 });

    delete user.password;
    return user;
  }
}
