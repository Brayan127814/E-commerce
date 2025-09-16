import { PartialType } from '@nestjs/swagger';
import { CreateAsuarioDto } from './create-asuario.dto';

export class UpdateAsuarioDto extends PartialType(CreateAsuarioDto) {}
