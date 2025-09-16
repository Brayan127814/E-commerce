import { Producto } from "src/productos/entities/producto.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('categorias')
export class Categoria {

    @PrimaryGeneratedColumn()
    public id: number


    @Column()
    public categoryName: string

    @Column()
    public descripcion: string

    @OneToMany(()=> Producto, (producto)=> producto.categoria)
     producto:Producto[]


}
