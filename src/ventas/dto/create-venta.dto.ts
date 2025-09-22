import { IsNumber, Min, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateVentaDetalleDto } from "./datalles.dto";

export class CreateVentaDto {
    @IsNumber()
    @Min(1, { message: 'Debes escoger al menos un producto' })
    public cantidad: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateVentaDetalleDto)
    detalles: CreateVentaDetalleDto[];
}
