import { Categoria } from "src/categorias/entities/categoria.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('productos')
export class Producto {

    @PrimaryGeneratedColumn()
    public id: number


    @Column()
    public productName: string

    @Column()
    public descripcion: string

    @Column()
    public stock: number

    @Column()
    public price: number

    @ManyToOne(() => Categoria, (categoria) => categoria.producto)
    categoria: Categoria


}
