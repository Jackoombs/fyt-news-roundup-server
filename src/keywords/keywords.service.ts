import { Injectable } from '@nestjs/common';
import { Article } from '@prisma/client';

@Injectable()
export class KeywordsService {
  sortBySimilarity(articles: Article[], targetKeywords: string[]) {
    const sortedArticles = [...articles];

    sortedArticles.sort((a, b) =>
      this.compareBySimilarity(a, b, targetKeywords),
    );

    return sortedArticles;
  }

  compareBySimilarity(
    articleA: Article,
    articleB: Article,
    targetKeywords: string[],
  ) {
    const keywordsA = articleA.keywords;
    const keywordsB = articleB.keywords;

    // Count the number of similar keywords for each article
    const similarityA = this.countSimilarKeywords(keywordsA, targetKeywords);
    const similarityB = this.countSimilarKeywords(keywordsB, targetKeywords);

    // Compare the similarity counts
    if (similarityA < similarityB) {
      return 1;
    } else if (similarityA > similarityB) {
      return -1;
    } else {
      return 0;
    }
  }

  countSimilarKeywords(keywordsA: string[], keywordsB: string[]) {
    const setA = new Set(keywordsA);
    const setB = new Set(keywordsB);

    let count = 0;

    for (const keyword of setA) {
      if (setB.has(keyword)) {
        count++;
      }
    }

    return count;
  }
}
