import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository:Repository<User>,
    ){}

    async create(email:string,createUserDto:CreateUserDto):Promise<User>{
        const salt = await bcrypt.genSalt()
        createUserDto.password = await bcrypt.hash(createUserDto.password,salt)
        const user = await this.userRepository.create(createUserDto)
        await this.userRepository.save(user)
        return user
    }

    async update(id:number,updateUserDto:UpdateUserDto):Promise<User>{
        const user = await this.userRepository.preload({
            id,
            ...updateUserDto
        })
        if(!user) throw new NotFoundException(`User with ID ${id} not found`)
        return user
    }


    async enter(email:string,password:string):Promise<User>{
        const user = await this.userRepository.findOneBy({email})
        if(!user) throw new NotFoundException('User Not Found')
        return user
    }
}

