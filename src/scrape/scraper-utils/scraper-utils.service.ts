import { Inject, Injectable } from '@nestjs/common';
import * as url from 'url';

@Injectable()
export class ScraperUtilsService {
  constructor(@Inject('STOPWORDS') private stopWords: string[]) {}

  getKeyWords(title: string) {
    const cleanText = this.cleanText(title);
    const textArray = cleanText
      .split(' ')
      .map((word) => word.toLowerCase())
      .filter((word) => !this.stopWords.includes(word));
    return Array.from(new Set(textArray));
  }

  cleanText(str: string) {
    return (
      str
        // removes unwanted special characters
        .replace(/(?<=\s|^)[^\w\s]|[^\w\s](?=\s|$)/g, '')
        //removes whitespace
        .replace(/\s+/g, ' ')
        .trim()
    );
  }

  joinArticleContent(contentArray: (string | null)[]) {
    return contentArray
      .map((paragraph) => paragraph?.trim())
      .filter(Boolean)
      .join('\n');
  }

  getUrlDirectory(urlString: string, directoryIndex: number) {
    const parsedUrl = url.parse(urlString);
    if (!parsedUrl.pathname) {
      return undefined;
    }
    const directories = parsedUrl.pathname.split('/').slice(1);
    const directory: string | undefined = directories[directoryIndex];
    return directory ?? undefined;
  }
}
