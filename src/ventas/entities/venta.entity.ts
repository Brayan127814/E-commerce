import { CONFIGURABLE_MODULE_ID } from "@nestjs/common/module-utils/constants";
import { Usuario } from "src/asuarios/entities/asuario.entity";
import { ESTADOVENTA } from "src/enum/ventas.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DetalleVentas } from "./venta.detalles.entity";
import { Producto } from "src/productos/entities/producto.entity";
import { Expose } from "class-transformer";



@Entity('ventas')
export class Venta {
    @Expose()
    @PrimaryGeneratedColumn()
    public id: number
    @Expose()
    @Column()
    public total: number
    @Expose()
    @ManyToOne(() => Usuario, (user) => user.ventas)
    @JoinColumn({ name: 'usuario' })
    usuario: Usuario

    @Expose()
    @CreateDateColumn({ name: 'fecha_venta', type: 'timestamp' })
    fechaVenta: Date;
    @Expose()
    @Column({ default: ESTADOVENTA.PENDIENTE })
    public estado: string
    @Expose()
    @OneToMany(() => DetalleVentas, (detalle) => detalle.venta)
    detalles: DetalleVentas[]
}
