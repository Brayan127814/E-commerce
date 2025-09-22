import { Expose } from "class-transformer";
import { Categoria } from "src/categorias/entities/categoria.entity";
import { DetalleVentas } from "src/ventas/entities/venta.detalles.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('productos')
export class Producto {
    @Expose()
    @PrimaryGeneratedColumn()
    public id: number

    @Expose()
    @Column()
    public productName: string
    @Expose()
    @Column()
    public descripcion: string
    @Expose()
    @Column()
    public stock: number
    @Expose()
    @Column()
    public price: number
    @Expose()
    @ManyToOne(() => Categoria, (categoria) => categoria.producto)
    categoria: Categoria
    @Expose()
    @OneToMany(() => DetalleVentas, (details) => details.producto)
    detalles: DetalleVentas[]


}
