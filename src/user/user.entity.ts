
import { Column, PrimaryGeneratedColumn, Entity } from "typeorm"

export enum Role {
  USER = 'user',
  LIBRARIAN = 'librarian',
  ADMIN = 'admin',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    name:string

    @Column({unique:true})
    email:string

    @Column()
    password:string

    @Column({
         type:'enum',
         enum:Role,
         default:Role.USER
    })
    role:Role
}
