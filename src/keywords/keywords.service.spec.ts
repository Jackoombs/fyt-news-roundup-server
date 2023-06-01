import { Test, TestingModule } from '@nestjs/testing';
import { KeywordsService } from './keywords.service';
import { Article } from '@prisma/client';

describe('KeywordsService', () => {
  let service: KeywordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeywordsService],
    }).compile();

    service = module.get<KeywordsService>(KeywordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('countSimilarKeywords', () => {
    it('should return 1 when same array of length 1', () => {
      expect(service.countSimilarKeywords(['word'], ['word'])).toEqual(1);
    });

    it('should return 0 when no keywords the same', () => {
      expect(service.countSimilarKeywords(['word'], ['differentWord'])).toEqual(
        0,
      );
    });

    it('should return 0 when arrays empty', () => {
      expect(service.countSimilarKeywords([], [])).toEqual(0);
    });

    it('should return when when mixture of identical and different words', () => {
      expect(
        service.countSimilarKeywords(
          [
            'word',
            'word2',
            'word3',
            'word4',
            'word5',
            'word6',
            'word7',
            'word8',
          ],
          ['word2', 'word3', 'word5', 'word6', 'word8', 'word9', 'word10'],
        ),
      ).toEqual(5);
    });
  });

  describe('compareBySimilarity', () => {
    it('should return 1 if article A has less keywords', () => {
      const articleA: Article = {
        id: 'id',
        title: null,
        category: null,
        outletId: 'id',
        summary: null,
        content: null,
        condensedBody: null,
        link: 'link',
        saved: true,
        keywords: ['word1', 'word2'],
        date: null,
      };

      const articleB: Article = {
        id: 'id',
        title: null,
        category: null,
        outletId: 'id',
        summary: null,
        content: null,
        condensedBody: null,
        link: 'link',
        saved: true,
        keywords: ['word3', 'word4'],
        date: null,
      };

      const targetKeywords = ['word3', 'word4'];

      expect(
        service.compareBySimilarity(articleA, articleB, targetKeywords),
      ).toEqual(1);
    });

    it('should return 0 if article A has same no. of keywords', () => {
      const articleA: Article = {
        id: 'id',
        title: null,
        category: null,
        outletId: 'id',
        summary: null,
        content: null,
        condensedBody: null,
        link: 'link',
        saved: true,
        keywords: ['word1', 'word2'],
        date: null,
      };

      const articleB: Article = {
        id: 'id',
        title: null,
        category: null,
        outletId: 'id',
        summary: null,
        content: null,
        condensedBody: null,
        link: 'link',
        saved: true,
        keywords: ['word1', 'word2'],
        date: null,
      };

      const targetKeywords = ['word2'];

      expect(
        service.compareBySimilarity(articleA, articleB, targetKeywords),
      ).toEqual(0);
    });
    it('return -1 if article A has more keywords', () => {
      const articleA: Article = {
        id: 'id',
        title: null,
        category: null,
        outletId: 'id',
        summary: null,
        content: null,
        condensedBody: null,
        link: 'link',
        saved: true,
        keywords: ['word1', 'word2'],
        date: null,
      };

      const articleB: Article = {
        id: 'id',
        title: null,
        category: null,
        outletId: 'id',
        summary: null,
        content: null,
        condensedBody: null,
        link: 'link',
        saved: true,
        keywords: ['word3', 'word4'],
        date: null,
      };

      const targetKeywords = ['word1', 'word2', 'word3'];

      expect(
        service.compareBySimilarity(articleA, articleB, targetKeywords),
      ).toEqual(-1);
    });
  });

  describe('sortBySimilarity', () => {
    it('should sort articles with most similar keywords first', () => {
      const articles: Article[] = [
        {
          id: '1',
          title: null,
          category: null,
          outletId: 'id',
          summary: null,
          content: null,
          condensedBody: null,
          link: 'link',
          saved: true,
          keywords: ['word1', 'word2', 'word3'],
          date: null,
        },
        {
          id: '2',
          title: null,
          category: null,
          outletId: 'id',
          summary: null,
          content: null,
          condensedBody: null,
          link: 'link',
          saved: true,
          keywords: ['word3', 'word4', 'word5'],
          date: null,
        },
        {
          id: '3',
          title: null,
          category: null,
          outletId: 'id',
          summary: null,
          content: null,
          condensedBody: null,
          link: 'link',
          saved: true,
          keywords: ['word4', 'word5', 'word6'],
          date: null,
        },
      ];

      const targetKeywords = ['word3', 'word4', 'word5'];

      expect(
        service.sortBySimilarity(articles, targetKeywords).map((e) => e.id),
      ).toStrictEqual(['2', '3', '1']);
    });
  });
});
