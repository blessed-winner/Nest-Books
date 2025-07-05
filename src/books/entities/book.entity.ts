import { Column, PrimaryGeneratedColumn, Entity } from "typeorm"

@Entity()
export class Book {
   @PrimaryGeneratedColumn()
   id:number

   @Column({unique:true})
   title:string

   @Column()
   author:string
}
