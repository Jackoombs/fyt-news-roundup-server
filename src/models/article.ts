import { PrismaClient } from "@prisma/client";
import { Article } from "src/type";
import { findOutletByName } from "./outlet";
const prisma = new PrismaClient();

const createArticle = async (article: Article) => {
  let outlet = await findOutletByName(article.outlet);

  const newArticle = await prisma.article.create({
    data: {
      title: article.title,
      category: article.category,
      outlet: {
        connect: {
          id: outlet.id,
        },
      },
      summary: article.summary,
      content: article.content,
      link: article.link,
      date: article.date,
      keywords: article.keywords,
    },
  });
  return newArticle;
};

export const postArticles = async (articles: Article[]) => {
  for (const article of articles) {
    let isArticle = await getArticle(article.link);

    if (isArticle) {
      await prisma.article.update({
        where: {
          link: article.link,
        },
        data: {
          count: isArticle.count + 1,
          category: article.category,
          title: article.title,
          summary: article.summary,
          keywords: article.keywords,
        },
      });
    } else {
      await createArticle(article);
    }
  }
};

export const getArticle = async (link: string) => {
  const article = await prisma.article.findUnique({
    where: {
      link,
    },
  });
  return article;
};
