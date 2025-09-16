import { IsString, IsEmail, MaxLength, MinLength } from "class-validator";


export class CreateAsuarioDto {

    @IsString()
    @MaxLength(15)
    @MinLength(3)
    public name: string


    @IsString()
    @MaxLength(15)
    @MinLength(3)
    public lastName: string

    @IsEmail()
    public email: string

    @IsString()
    @MaxLength(100)
    public addres: string

    @IsString()
    public password: string



}
