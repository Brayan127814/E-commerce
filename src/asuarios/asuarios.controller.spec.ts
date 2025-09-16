import { Test, TestingModule } from '@nestjs/testing';
import { AsuariosController } from './asuarios.controller';
import { AsuariosService } from './asuarios.service';

describe('AsuariosController', () => {
  let controller: AsuariosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AsuariosController],
      providers: [AsuariosService],
    }).compile();

    controller = module.get<AsuariosController>(AsuariosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
