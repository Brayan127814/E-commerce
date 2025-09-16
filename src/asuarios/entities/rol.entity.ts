import { UseGuards } from "@nestjs/common";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./asuario.entity";
import { Expose } from "class-transformer";


@Entity('roles')
export class Roles {
    @PrimaryGeneratedColumn()
    public id: number

    @Column()
    @Expose()
    public roleName: string

    @Column()
    @Expose()
    public descripcion: string

    @Expose()
    @OneToMany(() => Usuario, (u) => u.rol)
    user: Usuario[]
}