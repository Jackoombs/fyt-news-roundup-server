export interface Article {
  title?: string;
  category?: string;
  outlet: string;
  summary?: string;
  content?: string;
  condensedContent?: string;
  link: string;
  date?: Date;
  keywords: string[];
}
