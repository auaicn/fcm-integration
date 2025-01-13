import { Test, TestingModule } from '@nestjs/testing';
import { FcmServiceService } from './fcm-service.service';

describe('FcmServiceService', () => {
  let service: FcmServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FcmServiceService],
    }).compile();

    service = module.get<FcmServiceService>(FcmServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
