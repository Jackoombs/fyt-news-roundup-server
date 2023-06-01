import { Injectable } from '@nestjs/common';
import { ScrapeArticlesService } from '../scrape-articles/scrape-articles.service';
import { OutletService } from 'src/outlet/outlet.service';
import { OnApplicationBootstrap } from '@nestjs/common';
import { BrowserService } from '../browser/browser.service';

@Injectable()
export class ScrapeManagerService implements OnApplicationBootstrap {
  constructor(
    private scrapeArticlesService: ScrapeArticlesService,
    private outletService: OutletService,
    private browserService: BrowserService,
  ) {}

  async onApplicationBootstrap() {
    // const outlets = await this.outletService.findAll();
    // await this.browserService.openBrowser();
    // await this.scrapeArticlesService.scrapeArticles(outlets);
  }
}
