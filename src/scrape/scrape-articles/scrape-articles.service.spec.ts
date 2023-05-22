import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeArticlesService } from './scrape-articles.service';

describe('ScrapeArticlesService', () => {
  let service: ScrapeArticlesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrapeArticlesService],
    }).compile();

    service = module.get<ScrapeArticlesService>(ScrapeArticlesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
