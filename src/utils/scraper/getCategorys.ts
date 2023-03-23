import { link } from "fs";
import { Browser, Page } from "puppeteer";
import { postCategorys } from "src/models/category";
import { getAllOutlets } from "src/models/outlet";
import { Category } from "src/type";
import { changePage, newPage } from "./scraper";

export const getCategorys = async (browser: Browser) => {
  const outlets = await getAllOutlets();

  const getCategorys = async (
    page: Page,
    baseUrl: string,
    navSelector: string,
    anchorSelector: string
  ) => {
    await changePage(page, baseUrl);
    const nav = await page.waitForSelector(navSelector);
    return await nav?.$$eval(anchorSelector, (els) =>
      els.map((el: HTMLAnchorElement) => el.href)
    );
  };

  const createAndPostCategorys = async (
    links: string[] | undefined,
    outletName: string
  ) => {
    if (links) {
      const categorys: Category[] = links.map((link) => {
        return { url: link, outlet: outletName };
      });
      await postCategorys(categorys);
    }
  };

  const updateCategorys = async () => {
    const categorys = await Promise.all(
      outlets.map(async (outlet) => {
        let links: string[] | undefined = [];
        const page = await newPage(browser);
        switch (outlet.name) {
          case "BBC":
            links = await getCategorys(page, outlet.baseUrl, "aria/news", "a");
            break;
          case "Daily Mail":
            links = await getCategorys(
              page,
              outlet.baseUrl,
              ".nav-primary",
              "a"
            );
            links = links?.filter((link) => !link.includes("discountcode"));
            break;
          case "The Guardian":
            links = await getCategorys(
              page,
              outlet.baseUrl,
              "#main-menu",
              "a:not(.menu-group--footer a):not(.menu-group--brand-extensions a)"
            );
            break;
          case "The Independant":
            links = await getCategorys(page, outlet.baseUrl, ".dXLrlK", "a");
            break;
        }
        console.log(links);
        await createAndPostCategorys(links, outlet.name);
        await page.close();
      })
    );
  };

  await updateCategorys();
};
