import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "./rol.entity";
import { Exclude, Expose } from "class-transformer";
import { Venta } from "src/ventas/entities/venta.entity";


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


    @Expose()
    @OneToMany(()=>Venta, (venta)=> venta.usuario)
     ventas: Venta[]
}
