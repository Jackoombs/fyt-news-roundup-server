import { Test, TestingModule } from '@nestjs/testing';
import { ThedailymailArticleScraperService } from './thedailymail-article-scraper.service';

describe('ThedailymailArticleScraperService', () => {
  let service: ThedailymailArticleScraperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThedailymailArticleScraperService],
    }).compile();

    service = module.get<ThedailymailArticleScraperService>(ThedailymailArticleScraperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
