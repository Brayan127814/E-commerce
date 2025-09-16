import { Test, TestingModule } from '@nestjs/testing';
import { AsuariosService } from './asuarios.service';

describe('AsuariosService', () => {
  let service: AsuariosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AsuariosService],
    }).compile();

    service = module.get<AsuariosService>(AsuariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
