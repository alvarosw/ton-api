import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
const db = new DynamoDBClient({});

module.exports = db;
