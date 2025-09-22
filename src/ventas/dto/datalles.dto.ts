import { IsNumber, IsPositive } from "class-validator";


export class CreateVentaDetalleDto {

      @IsNumber()
      public productoId: number
      @IsNumber()
      @IsPositive()
      public cantidad: number

}