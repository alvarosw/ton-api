import { randomUUID } from 'crypto';
import dynamodb from 'dynamodb';
import Joi from 'joi';

type UserProps = {
  userId: string;
  name: string;
  email: string;
  password: string;
};

const ModelDef = dynamodb.define('User', {
  hashKey: 'userId',
  tableName: process.env.USERS_TABLE,
  schema: {
    userId: Joi.string().default(randomUUID()),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },
});

export default class User extends ModelDef<UserProps> {
  static async getByEmail(email: string) {
    const [scan] = await User.scan().where('email').equals(email).exec().promise();

    return (scan.Items[0]?.attrs as UserProps) || null;
  }
}
