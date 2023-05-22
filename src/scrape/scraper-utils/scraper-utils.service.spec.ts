import { Test, TestingModule } from '@nestjs/testing';
import { ScraperUtilsService } from './scraper-utils.service';

describe('ScraperUtilsService', () => {
  let service: ScraperUtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScraperUtilsService],
    }).compile();

    service = module.get<ScraperUtilsService>(ScraperUtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
