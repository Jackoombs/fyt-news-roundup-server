import { Page } from "puppeteer";
import {
  getGuardianDate,
  getKeyWords,
  getUrlDirectory,
  joinArticleContent,
} from "../textProcessing/textProcessing";
import { changePage } from "./scraper";
import { stopWords } from "../textProcessing/stopwords";
import { Article } from "../../type";

export const getArticles = (() => {
  const getBbcArticles = async (page: Page, outletName: string) => {
    const articleCards = await page.$$(".gs-c-promo");
    let articles: Article[] = await Promise.all(
      articleCards.slice(0, 4).map(async (card) => {
        const link = await card.$eval("a", (el) => el.href);
        const summary = await card.$eval("p", (el) => el.textContent);
        const title = await card.$eval("a", (el) => el.firstChild?.textContent);
        const date = await page.$eval("time", (el) =>
          el.getAttribute("datetime")
        );
        const category = await card.$eval(
          ".nw-c-promo-meta a span",
          (el) => el.textContent
        );

        return {
          link,
          summary: summary?.trim() ?? undefined,
          title: title?.trim() ?? undefined,
          category: category ?? undefined,
          outlet: outletName,
          keywords: title ? getKeyWords(title, stopWords) : [],
          date: date ? new Date(date) : undefined,
        };
      })
    );

    for (const article of articles) {
      await changePage(page, article.link);
      const articleElement = await page.$("article");
      const paragraphs = await articleElement?.$$("p, h2");

      if (paragraphs) {
        const contentArray = await Promise.all(
          paragraphs.map((paragraph) =>
            page.evaluate((element) => {
              if (element.parentElement?.nodeName !== "SPAN") {
                return element.textContent;
              } else {
                return null;
              }
            }, paragraph)
          )
        );
        const content = joinArticleContent(contentArray);
        article.content = content;
      }
    }
    return articles;
  };

  const getDailyMailArticles = async (page: Page, outletName: string) => {
    const articleCards = await page.$$(".article");

    let articles: Article[] = await Promise.all(
      articleCards.slice(0, 4).map(async (card) => {
        const link = await card.$eval("h2 a", (el) => el.href);
        const summary = await card.$eval("p", (el) => el.textContent);
        const title = await card.$eval("h2 a", (el) => el.textContent);

        return {
          link,
          summary: summary?.trim() ?? undefined,
          title: title?.trim() ?? undefined,
          category: getUrlDirectory(link, 1),
          outlet: outletName,
          keywords: getKeyWords(title, stopWords),
        };
      })
    );

    for (const article of articles) {
      await changePage(page, article.link);
      const date = await page.$eval("time", (el) =>
        el.getAttribute("datetime")
      );
      const articleElement = await page.$('[itemprop="articleBody"]');
      const paragraphs = await articleElement?.$$("p");

      if (paragraphs) {
        const contentArray = await Promise.all(
          paragraphs.map((paragraph) =>
            page.evaluate((element) => {
              return element.textContent;
            }, paragraph)
          )
        );
        const content = joinArticleContent(contentArray);

        article.content = content;
        article.date = date ? new Date(date) : undefined;
      }
    }

    return articles;
  };

  const getIndependantArticles = async (page: Page, outletName: string) => {
    const articleCards = await page.$$(".article");

    let articles: Article[] = await Promise.all(
      articleCards.slice(0, 4).map(async (card) => {
        const link = await card.$eval("h2 a", (el) => el.href);
        const title = await card.$eval("h2 a", (el) => el.textContent);

        return {
          link,
          title: title?.trim() ?? undefined,
          category: getUrlDirectory(link, 0),
          outlet: outletName,
          keywords: getKeyWords(title, stopWords),
        };
      })
    );

    for (const article of articles) {
      console.log(article.link);
      await changePage(page, article.link);
      const dateString = await page.$eval("time", (el) =>
        el.getAttribute("datetime")
      );
      const articleElement = await page.$("#main");
      const paragraphs = await articleElement?.$$("p");
      const summary = await page.$eval("h2", (el) => el.textContent);
      if (paragraphs) {
        const contentArray = await Promise.all(
          paragraphs.map((paragraph) =>
            page.evaluate((element) => {
              return element.textContent;
            }, paragraph)
          )
        );
        const content = joinArticleContent(contentArray);

        article.content = content;
      }
      article.date = dateString ? new Date(Date.parse(dateString)) : undefined;
      article.summary = summary ?? undefined;
    }

    return articles;
  };

  const getGuardianArticles = async (page: Page, outletName: string) => {
    const articleCards = await page.$$(".fc-item__content ");

    let articles: Article[] = await Promise.all(
      articleCards.slice(0, 4).map(async (card) => {
        const link = await card.$eval("h3 a", (el) => el.href);
        const title = await card.$eval("h3 a span", (el) => el.textContent);

        return {
          link,
          title: title?.trim() ?? undefined,
          outlet: outletName,
          keywords: getKeyWords(title, stopWords),
        };
      })
    );

    for (const article of articles) {
      await changePage(page, article.link);
      const dateEl = await page.$eval("summary, time", (el) => {
        const elName = el.nodeName;
        if (elName === "TIME") {
          return { name: el.nodeName, dateString: el.getAttribute("datetime") };
        } else {
          return { name: el.nodeName, dateString: el.textContent };
        }
      });

      const date =
        dateEl.name === "TIME" && dateEl.dateString
          ? new Date(Date.parse(dateEl.dateString))
          : dateEl.dateString
          ? getGuardianDate(dateEl.dateString)
          : undefined;

      const articleElement = await page.$("#maincontent");
      const paragraphs = await articleElement?.$$("h2, p");
      const category = await page.$eval(
        '[data-link-name="article section"]',
        (el) => el.textContent
      );
      const summary = await page.$eval("p", (el) => el.textContent);

      if (paragraphs) {
        const contentArray = await Promise.all(
          paragraphs.map((paragraph) =>
            page.evaluate((element) => {
              return element.textContent;
            }, paragraph)
          )
        );
        const content = joinArticleContent(contentArray);

        article.content = content;
        article.date = date;
        article.category = category ?? undefined;
        article.summary = summary ?? undefined;
      }
    }

    return articles;
  };

  return {
    getBbcArticles,
    getDailyMailArticles,
    getGuardianArticles,
    getIndependantArticles,
  };
})();
