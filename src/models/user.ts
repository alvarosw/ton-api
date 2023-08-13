import Joi from 'joi';
import { randomUUID } from 'crypto';
import dynamodb, { Model } from 'dynamodb';

type UserObject = {
  id: string;
  name: string;
  email: string;
  password: string;
};

const requiredMsg = (fieldName: string) => ({ 'any.required': `Field ${fieldName} is required` });
const ModelDef: Model<UserObject> = dynamodb.define('User', {
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

export default class User extends ModelDef {
  static async getByEmail(email: string): Promise<UserObject | null> {
    const [scan] = await User.scan().where('email').equals(email).exec().promise();

    return (scan.Items[0]?.attrs as UserObject) || null;
  }

  static async getById(id: string): Promise<UserObject | null> {
    return (await this.get(id))?.attrs || null;
  }
}
