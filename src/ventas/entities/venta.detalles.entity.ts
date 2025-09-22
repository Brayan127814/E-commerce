
import { Producto } from "src/productos/entities/producto.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Venta } from "./venta.entity";
import { Expose } from "class-transformer";

@Entity('detalles')

export class DetalleVentas {
    @Expose()
    @PrimaryGeneratedColumn()
    public id: number;
    @Expose()
    @Column()
    public cantidad: number;
    @Expose()
    @Column()
    public precioUnitario: number;

    @Expose()
    @ManyToOne(() => Producto, (producto) => producto.detalles)
    producto: Producto
    @Expose()
    @ManyToOne(() => Venta, (v) => v.detalles)
    venta: Venta
}