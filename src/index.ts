import { $log } from "@tsed/common";
import { PlatformExpress } from "@tsed/platform-express";
import { Server } from "./Server";
import { scheduleScraping, scrapeSites } from "./utils/scraper/scraper";

const bootstrap = async () => {
  try {
    const platform = await PlatformExpress.bootstrap(Server);
    await platform.listen();
    await scrapeSites();
    await scheduleScraping();

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
