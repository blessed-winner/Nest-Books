import {
  IsString,
  IsEmail,
  MinLength,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Role } from '../../user/user.entity';

export class AdminCreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role;

  @IsBoolean()
  isVerified: boolean;
}
