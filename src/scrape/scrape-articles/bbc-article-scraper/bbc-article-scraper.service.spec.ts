import { Test, TestingModule } from '@nestjs/testing';
import { BbcArticleScraperService } from './bbc-article-scraper.service';

describe('BbcArticleScraperService', () => {
  let service: BbcArticleScraperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BbcArticleScraperService],
    }).compile();

    service = module.get<BbcArticleScraperService>(BbcArticleScraperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
