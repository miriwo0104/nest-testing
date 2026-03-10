import { z } from 'zod';
import { createUserSchema } from './create-user.dto';

export const updateUserSchema = createUserSchema.partial(); // createUserSchemaをパラレルですべてのキーの値を非必須に設定

export type UpdateUserDto = z.infer<typeof updateUserSchema>; // 型推論