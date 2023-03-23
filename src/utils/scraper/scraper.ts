import { $log } from "@tsed/common";
import { Outlet } from "@prisma/client";
import { Page, Browser } from "puppeteer";
import { postArticles } from "src/models/article";
import { getAllOutlets } from "src/models/outlet";
import { getArticles } from "./getArticles";
import { Article } from "../../type";
import { getCategorys } from "./getCategorys";

export const scheduleScraping = async (browser: Browser) => {
  const now = new Date();
  const hour = now.getUTCHours();

  if (hour >= 18 && hour <= 22) {
    await scrapeSites(browser);
  }

  if (hour >= 23 && hour <= 0) {
    await getCategorys(browser);
  }

  setTimeout(scheduleScraping, 30 * 60 * 1000);
};

export const scrapeSites = async (browser: Browser) => {
  try {
    await scrapeAndPostOutlets(browser);
  } catch (error) {
    $log.error({
      event: "SCRAPE_ERROR",
      message: error.message,
      stack: error.stack,
    });
  }
};

export const newPage = async (browser: Browser) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });
  return page;
};

export const changePage = async (page: Page, url: string) => {
  await page.goto(url);
  await page.waitForSelector("body");
};

const scrapeAndPostOutlets = async (browser: Browser) => {
  const outlets = await getAllOutlets();

  const articles = await Promise.all(
    outlets.flatMap((outlet) =>
      outlet.categorys.map((category) =>
        scrapeOutletUrl(browser, outlet, category.url)
      )
    )
  );

  return articles.flat();
};

const scrapeOutletUrl = async (
  browser: Browser,
  outlet: Outlet,
  url: string
) => {
  const page = await newPage(browser);
  await changePage(page, url);

  let articles: Article[] = [];
  console.table(outlet);

  switch (outlet.name) {
    case "BBC":
      articles = await getArticles.getBbcArticles(page, outlet.name);
      break;
    case "Daily Mail":
      articles = await getArticles.getDailyMailArticles(page, outlet.name);
      break;
    case "The Guardian":
      articles = await getArticles.getGuardianArticles(page, outlet.name);
      break;
    case "The Independant":
      articles = await getArticles.getIndependantArticles(page, outlet.name);
      break;
  }

  await page.close();
  return await postArticles(articles);
};
