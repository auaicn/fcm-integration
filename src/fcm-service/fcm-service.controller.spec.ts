import { Test, TestingModule } from '@nestjs/testing';
import { FcmServiceController } from './fcm-service.controller';

describe('FcmServiceController', () => {
  let controller: FcmServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FcmServiceController],
    }).compile();

    controller = module.get<FcmServiceController>(FcmServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
