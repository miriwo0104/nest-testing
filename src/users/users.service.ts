import { Injectable } from '@nestjs/common';
import { type CreateUserDto, type User } from './dto/create-user.dto';
import { type UpdateUserDto } from './dto/update-user.dto';
import { ulid } from 'ulidx';
import { ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb } from '../dynamodb.client';

@Injectable()
export class UsersService {

  /**
   * ユーザー作成
   *
   * @param createUserDto
   * @returns
   */
  async create(createUserDto: CreateUserDto): Promise<User | undefined> {
    const userId: string = ulid(); // ULID生成
    const user: User = {
      id: userId, // 生成したULIDを割り当て
      ...createUserDto, // リクエストボディのオブジェクトをスプレッド構文でオブジェクトに格納
    };

    try {
      await dynamoDb.send(new PutCommand({
        TableName: 'Users',
        Item: {
          id: userId,
          ...createUserDto,
        },
      }));

      return user;
    } catch (error) {
      console.log('失敗', error);
      return undefined;
    }
  }

  /**
   * ユーザー一覧取得
   *
   * @returns
   */
  async findAll(): Promise<User[]> {
    try {
      const results = await dynamoDb.send(new ScanCommand({ // Partition Keyを使わない全件取得なので遅いから注意
        TableName: 'Users',
      }));

      return (results.Items as User[]) ?? [];
    } catch (error) {
      console.log('失敗', error);
      return [];
    }
  }

  /**
   * ユーザー取得
   *
   * @param id
   * @returns
   */
  async findOne(id: string): Promise<User | undefined> {
    return this.findById(id);
  }

  /**
   * ユーザー更新
   *
   * @param id
   * @param updateUserDto
   * @returns
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | undefined> {
    try {
      const result = await dynamoDb.send(new UpdateCommand({
        TableName: 'Users',
        Key: {
          id: id,
        },
        UpdateExpression: 'set #name = :name, email = :email',
        ExpressionAttributeNames: {
          '#name': 'name', // nameはDynamoDBの予約語のためエイリアスを使用
        },
        ExpressionAttributeValues: {
          ':name': updateUserDto.name,
          ':email': updateUserDto.email,
        },
        ReturnValues: 'ALL_NEW',
      }));

      return result.Attributes as User | undefined;
    } catch (error) {
      console.log('失敗', error);
      return undefined;
    }
  }

  /**
   * ユーザー削除
   *
   * @param id
   * @returns
   */
  async remove(id: string): Promise<User | undefined> {
    try {
      const result = await dynamoDb.send(new DeleteCommand({
        TableName: 'Users',
        Key: {
          id: id,
        },
        ReturnValues: 'ALL_OLD',
      }));

      return result.Attributes as User | undefined;
    } catch (error) {
      console.log('失敗', error);
      return undefined;
    }
  }

  /**
   * ユーザー特定
   *
   * @param id
   * @returns
   */
  private async findById(id: string): Promise<User | undefined> {
    try {
      const result = await dynamoDb.send(new GetCommand({
        TableName: 'Users',
        Key: {
          id: id,
        },
      }));

      return result.Item as User | undefined;
    } catch (error) {
      console.log('失敗', error);
      return undefined;
    }
  }
}
