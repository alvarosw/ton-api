import dynamodb from 'dynamodb';
import Joi from 'joi';
import { randomUUID } from 'crypto';

const User = dynamodb.define('User', {
  hashKey: 'userId',
  tableName: process.env.USERS_TABLE,
  schema: {
    userId: Joi.string().default(randomUUID()),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },
});

export default User;
