import { BadRequestException, Body, Controller, Post, Res, Patch, Param, UseFilters, Req, Get, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { TypeOrmExceptionFilter } from 'src/utils/Filters/exception-filters';

@UseFilters(TypeOrmExceptionFilter)
@Controller('auth')
export class UserController {
    constructor(
        private readonly userService:UserService,
        private jwtService:JwtService
    ){}

    @Post('signup')
    async signUp(@Body() createUserDto:CreateUserDto){
         await this.userService.create(createUserDto.email,createUserDto)
    }

    @Post('login')
    async logIn(@Body('email') email:string,
                @Body('password') password:string,
            @Res({passthrough:true}) res:Response){
            const user = await this.userService.enter(email,password)
            if(!user) throw new BadRequestException('Invalid Credentials')
            const authUser = await bcrypt.compare(password,user.password)
            if(!authUser) throw new BadRequestException('Invalid Credentials')
            const jwt = this.jwtService.signAsync({id:user.id},{expiresIn:'1d'})
            res.cookie('jwt',jwt,{httpOnly:true})
            return{
                message:'Success!!!'
            }
    }
    
    @Patch('update-profile')
    async modify(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto){
        await this.userService.update(+id,updateUserDto)
    }
}
