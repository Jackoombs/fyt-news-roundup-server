import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeManagerService } from './scrape-manager.service';

describe('ScrapeManagerService', () => {
  let service: ScrapeManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrapeManagerService],
    }).compile();

    service = module.get<ScrapeManagerService>(ScrapeManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
