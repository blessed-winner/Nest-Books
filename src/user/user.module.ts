import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[TypeOrmModule.forFeature([User]),
  JwtModule.register({
    secret:'secret',
    signOptions:{expiresIn:'1d'}
  })],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
