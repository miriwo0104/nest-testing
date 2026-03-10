import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: 'ap-northeast-1',
  endpoint: 'http://dynamodb-local:8000',
  credentials: {
    accessKeyId: 'dummy',
    secretAccessKey: 'dummy',
  },
});

export const dynamoDb = DynamoDBDocumentClient.from(client);
