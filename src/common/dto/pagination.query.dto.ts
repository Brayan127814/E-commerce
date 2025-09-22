import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

export class PaginationDto {
    @IsPositive()
    @IsOptional()
 
    public limit?: number


    @IsPositive()
    @IsOptional()

    public page?: number

}