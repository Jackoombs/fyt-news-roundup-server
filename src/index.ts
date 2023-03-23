import { $log } from "@tsed/common";
import { PlatformExpress } from "@tsed/platform-express";
import puppeteer from "puppeteer";
import { Server } from "./Server";
import { getCategorys } from "./utils/scraper/getCategorys";
import { scheduleScraping, scrapeSites } from "./utils/scraper/scraper";

const bootstrap = async () => {
  try {
    const platform = await PlatformExpress.bootstrap(Server);
    await platform.listen();
    const browser = await puppeteer.launch();
    await scrapeSites(browser);
    await scheduleScraping(browser);
    await getCategorys(browser);

    process.on("SIGINT", () => {
      platform.stop();
    });
  } catch (error) {
    $log.error({
      event: "SERVER_BOOTSTRAP_ERROR",
      message: error.message,
      stack: error.stack,
    });
  }
};

bootstrap();
