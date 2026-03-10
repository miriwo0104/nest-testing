import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { createUserSchema, type CreateUserDto } from './dto/create-user.dto'; // import typeに変更
import { updateUserSchema, type UpdateUserDto } from './dto/update-user.dto'; // import typeに変更

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // zodスキーマを用いてバリデーションチェック
  @Post()
  create(@Body(new ZodValidationPipe(createUserSchema)) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const user = this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(new ZodValidationPipe(updateUserSchema)) updateUserDto: UpdateUserDto) {
    const user = this.usersService.update(id, updateUserDto);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const user = this.usersService.remove(id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
