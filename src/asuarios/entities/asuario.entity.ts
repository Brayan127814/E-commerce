import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "./rol.entity";
import { Exclude, Expose } from "class-transformer";


@Entity('usuarios')
export class Usuario {

    @PrimaryGeneratedColumn()
    @Expose()
    public id: number

    @Column()
    @Expose()
    public name: string
    @Expose()
    @Column()
    public lastName: string

    @Expose()
    @Column()
    public email: string

    @Expose()
    @Column()
    public addres: string

    @Exclude()
    @Column()
    public password: string

    @Expose()
    @ManyToOne(() => Roles, (rol) => rol.user)
    rol: Roles
}
