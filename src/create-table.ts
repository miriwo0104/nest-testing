import { CreateTableCommand, DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb'

const config: DynamoDBClientConfig = {
  endpoint: 'http://localhost:8000',
  region: 'ap-northeast-1',
  credentials: { accessKeyId: 'dummy', secretAccessKey: 'dummy' },
}

const client = new DynamoDBClient(config);

async function createTable() {
  try {
    const command = new CreateTableCommand({
      TableName: 'Users',
      AttributeDefinitions: [
        {AttributeName: 'id', AttributeType: 'S'},
      ],
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' },
      ],
      BillingMode: 'PAY_PER_REQUEST',
    })

    const result = await client.send(command);
    console.log('テーブル作成成功', result);
  } catch (error) {
    console.error('エラー' , error);
  }
}

createTable();