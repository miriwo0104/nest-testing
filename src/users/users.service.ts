import { Injectable } from '@nestjs/common';
import { type CreateUserDto, type User } from './dto/create-user.dto';
import { type UpdateUserDto } from './dto/update-user.dto';
import { ulid } from 'ulidx';

@Injectable()
export class UsersService {
  private users: User[] = [];

  /**
   * ユーザー作成
   *
   * @param createUserDto
   * @returns
   */
  create(createUserDto: CreateUserDto): User {
    const userId: string = ulid(); // ULID生成
    const user: User = {
      id: userId, // 生成したULIDを割り当て
      ...createUserDto // リクエストボディのオブジェクトをスプレッド構文でオブジェクトに格納
    }

    this.users.push(user); // プロパティの配列に格納
    return user;
  }

  /**
   * ユーザー一覧取得
   *
   * @returns
   */
  findAll(): User[] {
    return this.users; // 一覧返却だからプロパティ返すだけ
  }

  /**
   * ユーザー取得
   *
   * @param id
   * @returns
   */
  findOne(id: string): User | undefined {
    return this.findById(id);
  }

  /**
   * ユーザー更新
   *
   * @param id
   * @param updateUserDto
   * @returns
   */
  update(id: string, updateUserDto: UpdateUserDto): User | undefined {
    const user = this.findById(id);
    if (!user) {
      return undefined;
    }

    const updateUser = {...user, ...updateUserDto}; // スプレッド構文でオブジェクトを展開して合体

    // usersプロパティをチェック、パスパラメーターのidと突き合わせ、一致したら更新用オブジェクトをmapで新しく作られるarrayに格納、一致しなければそのままmapで新しく作られるarrayに格納
    this.users = this.users.map(user => user.id === id ? updateUser : user);

    return updateUser;
  }

  /**
   * ユーザー削除
   *
   * @param id
   * @returns
   */
  remove(id: string): User | undefined {
    const deleteUser = this.findById(id);
    if (!deleteUser) {
      return undefined;
    }

    // userプロパティをチェック、パスパラメーターのidと突き合わせ、条件true（パスパラメータとして与えられたid以外）なら新しく作られるarrayに格納、条件false（パスパラメーターとして与えられたid）は新しく作られるarrayに格納しない
    this.users = this.users.filter(user => user.id !== id);

    return deleteUser;
  }

  /**
   * ユーザー特定
   *
   * @param id
   * @returns
   */
  private findById(id: string): User | undefined {  // ヒットしたらUser返却ヒットしなかったらfindはundefined返す
    return this.users.find(user => user.id === id);
  }
}
