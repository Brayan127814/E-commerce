import { IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateProductoDto {

    @IsString()
    @MinLength(6)
    @MaxLength(20)
    public productName: string


    @IsString()
    @MinLength(6)
    @MaxLength(100)
    public descripcion: string


    @IsNumber()
    @Min(1,{message:'El estock debe ser almenos uno'})
    public stock: number

    @IsNumber()
    @Min(0,{message:'el precio no puede ser negativo'})
    public price: number
}
