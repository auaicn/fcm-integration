import { Test, TestingModule } from '@nestjs/testing';
import { BgLogController } from './bg-log.controller';

describe('BgLogController', () => {
  let controller: BgLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BgLogController],
    }).compile();

    controller = module.get<BgLogController>(BgLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
