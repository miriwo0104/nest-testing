import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { dynamoDb } from '../dynamodb.client';

const testUlid : string = '01HTEST00000000000000000';

// NOTE: DBのモック
jest.mock('../dynamodb.client', () => ({
  dynamoDb: {
    send: jest.fn(),
  },
}));

// NOTE: テスト中のULIDの固定
jest.mock('ulidx', () => ({
  ulid: jest.fn(() => testUlid),
}));

const mockSend = dynamoDb.send as jest.Mock;

describe('UsersService', () => {
  let service: UsersService;

  // NOTE: テスト実行前処理
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  // NOTE: テスト実行後処理
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('セットアップ確認', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {

      const requestBody = {
        name: '太郎',
        email: 'taro@example.com',
      };

    describe('正常系', () => {
      
      it('ユーザー作成', async () => {
        mockSend.mockResolvedValueOnce({});
        
        const result = await service.create(requestBody);
        
        expect(result?.id).toBe(testUlid);
        expect(result?.email).toBe('taro@example.com');
        expect(result?.name).toBe('太郎')
      });
    });
    describe('異常系', () => {
      it('DynamoDBがエラーを投げた場合', async () => {
        mockSend.mockRejectedValueOnce(new Error('DynamoDB error'));

        const result = await service.create(requestBody);

        // NOTE: undefinedをチェックするマッチャー
        expect(result).toBeUndefined();
      });
    });


  });

  describe('findAll', () => {
    it('ユーザー一覧を返す', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [
          { id: 'id1', name: '太郎', email: 'taro@example.com' },
          { id: 'id2', name: '花子', email: 'hanako@example.com' },
        ],
      });

      const result = await service.findAll();
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('太郎');
    });

    it('DynamoDBがエラーを投げた場合は空配列を返す', async () => {
      mockSend.mockRejectedValueOnce(new Error('DynamoDB error'));

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    const expectedValue = {
      id: testUlid,
      name: '太郎',
      email: 'taro@example.com',
    };

    describe('正常系', () => {  
      it('ユーザーを一件返す', async () => {
        mockSend.mockResolvedValueOnce({
          // NOTE: findByIdメソッドで読んでるdynamoDb.sendをモックしているので、戻り値の形状をあわせるためにDynamoDB SDK返すレスポンスキーを指定
          Item: expectedValue
        });
        
        const result = await service.findOne(testUlid);
        console.log(result);
        expect(result?.id).toBe(testUlid);
        expect(result?.name).toBe(expectedValue.name);
        expect(result?.email).toBe(expectedValue.email);
      });
    });
    describe('異常系', () => {
      it('DynamoDBがエラーを投げた場合', async () => {
        mockSend.mockRejectedValueOnce(new Error('DynamoDB error'));

        const resutl = await service.findOne(testUlid);

        expect(resutl).toBeUndefined();
      });
    });
  });
});