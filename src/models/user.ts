import Joi from 'joi';
import { randomUUID } from 'crypto';
import dynamodb, { Model } from 'dynamodb';
import { User } from 'src/types/user';

const requiredMsg = (fieldName: string) => ({ 'any.required': `Field ${fieldName} is required` });
const ModelDef: Model<User> = dynamodb.define('User', {
  hashKey: 'id',
  tableName: process.env.USERS_TABLE,
  schema: {
    id: Joi.string().default(randomUUID()),
    name: Joi.string().required().messages(requiredMsg('name')),
    email: Joi.string()
      .email()
      .required()
      .messages({
        ...requiredMsg('email'),
        'string.email': 'Field email should be a valid email',
      }),
    password: Joi.string().required().messages(requiredMsg('password')),
  },
});

export default class UserRepository extends ModelDef {
  static async getByEmail(email: string): Promise<User | null> {
    const [scan] = await UserRepository
      .scan()
      .where('email')
      .equals(email)
      .exec()
      .promise();

    return (scan.Items[0]?.attrs as User) || null;
  }

  static async getById(id: string): Promise<User | null> {
    return (await this.get(id))?.attrs || null;
  }
}
