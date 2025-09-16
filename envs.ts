import Joi, * as joi from 'joi'
import dotenv from 'dotenv'


//Definir tipos

interface EnvsVar {
    BD_HOST: string,
    BD_DATABASE: string,
    BD_PORT: number,
    BD_USER: string,
    BD_PASSWORD: string,
    PORT: number,
    APIKEY: string
}

/**
 * 
 * Definir esquema
 */

const EnvsSchema = joi.object({
    BD_HOST: joi.string().required(),
    BD_DATABASE: joi.string().required(),
    BD_PORT: joi.number().default(3306),
    BD_PASSWORD: joi.string().required(),
    BD_USER: joi.string().required(),
    PORT: joi.number().default(4000),
    APIKEY: joi.string().required()

}).unknown(true)


const { error, value } = EnvsSchema.validate(process.env)

if (error) {

    throw new Error(`Config validation error: ${error.message}`);

}

export const Envs: EnvsVar = {
    BD_HOST: value.BD_HOST,
    BD_DATABASE: value.BD_DATABASE,
    BD_PORT: value.BD_PORT,
    BD_USER: value.BD_USER,
    BD_PASSWORD: value.BD_PASSWORD,
    PORT: value.PORT,
    APIKEY: value.APIKEY
}