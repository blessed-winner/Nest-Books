import { BadRequestException, Body, Controller, Post, Res, Patch, Param, UseFilters, Req, Get, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
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
        private readonly userService:UserService,
        private jwtService:JwtService
    ){}

    @Post('signup')
    async signUp(@Body() createUserDto:CreateUserDto){
         await this.userService.create(createUserDto.email,createUserDto)
    }
    
    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post('create')
    async adminRegister(@Body() dto:AdminCreateUserDto){
        await this.userService.adminCreate(dto.email,dto)
    }
    @Post('login')
    async logIn(@Body('email') email:string,
                @Body('password') password:string,
            @Res({passthrough:true}) res:Response){
            const user = await this.userService.enter(email,password)
            if(!user) throw new BadRequestException('Invalid Credentials')
            const authUser = await bcrypt.compare(password,user.password)
            if(!authUser) throw new BadRequestException('Invalid Credentials')
            const payload = {id:user.id,role:user.role}
            const jwt = this.jwtService.signAsync(payload)
            res.cookie('jwt',jwt,{httpOnly:true})
            return{
                message:'Success!!!'
            }
    }
    
    @Patch('profile')
    async modify(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto){
        await this.userService.update(+id,updateUserDto)
    }
}
