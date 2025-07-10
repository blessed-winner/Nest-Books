import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
  Patch,
  Param,
  UseFilters,
  Req,
  Get,
  UnauthorizedException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { TypeOrmExceptionFilter } from 'src/utils/Filters/exception-filters';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { Roles } from 'src/utils/decorator/roles.decorator';
import { Role } from './user.entity';
import { JwtAuthGuard } from 'src/utils/Guards/jwt-auth.guard';
import { RolesGuard } from 'src/utils/Guards/roles.guard';

@UseFilters(TypeOrmExceptionFilter)
@Controller('auth')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto.email, createUserDto);
  }

  @Get('verify-email')
  async verify(@Query('token') token: string) {
    return await this.userService.verifyUser(token);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('create')
  async adminRegister(@Body() dto: AdminCreateUserDto) {
    await this.userService.adminCreate(dto.email, dto);
  }
  @Post('login')
  async logIn(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.userService.enter(email, password);
    res.cookie('jwt', result.access_token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return { message: 'Login successful' };
  }

  @Patch('profile')
  async modify(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    await this.userService.update(+id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/history')
  findByUser(@Param('id') id: string) {
    return this.userService.getBorrowHistory(+id);
  }

  @Post('request-reset')
  requestReset(@Body() email: string) {
    return this.userService.requestPasswordReset(email);
  }

  @Post('reset-password')
  resetPassword(
    @Query('token') token: string,
    @Body('password') newPassword: string,
  ) {
    return this.userService.resetPassword(token, newPassword);
  }
}
