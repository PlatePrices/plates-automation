import { CheerioCrawler } from "crawlee";
import SELECTORS from "./config/selectors.js";

const startUrls = ["https://xplate.com/en/numbers/license-plates?page=2185"];

type Plate = {
  link: string;
  img: string;
  duration: string;
  price: string;
  emirate: string;
  character: string;
  number: string;
};

const validPlates: Plate[] = [];

const crawler = new CheerioCrawler({
  requestHandler: async ({ $, request, log, enqueueLinks }) => {
    log.info(`Scraping ${request.url}`);

    if ($(SELECTORS.ERROR_MESSAGE_SELECTOR).length) {
      log.info(
        `This is the last page, there is not plates in this page ${request.url}, stop scraping.`
      );
      return;
    }
    // reminder: I excluded the first element since it is not a plate
    const plates = Array.from($(SELECTORS.ALL_PLATES)).slice(1);

    plates.forEach((plate) => {
      /**
       * Another reminder: there is a possibility that some attributes have either one of the se values:
       * 1 - undefined
       * 2 - 'featured'
       * so we exclude them
       */
      const plateElement = $(plate);
      const imgSrc = plateElement.find("img").attr("data-src") || "";
      const price =
        plateElement.find(SELECTORS.PLATE_PRICE).text().trim() || "";
      const duration =
        plateElement.find(SELECTORS.PLATE_DURATION).text().trim() || "";
      const link = plateElement.find(SELECTORS.PLATE_LINK).attr("href") || "";

      const emirateMatch = link.match(/\/(\d+)-(.+?)-code-/);
      const characterMatch = link.match(/code-(\d+)-/);
      const numberMatch = link.match(/plate-number-(\d+)/);

      const emirate = emirateMatch ? emirateMatch[2] : "";
      const character = characterMatch ? characterMatch[1] : "";
      const number = numberMatch ? numberMatch[1] : "";
      const plateObj: Plate = {
        img: imgSrc,
        price,
        duration,
        link,
        emirate: emirate,
        character: character,
        number: number,
      };

      if (
        Object.values(plateObj).every(
          (value) => value && value !== "featured" && value !== ""
        )
      ) {
        validPlates.push(plateObj);
      }
    });

    const currentPage = parseInt(
      new URL(request.url).searchParams.get("page") || "1",
      10
    );
    const nextPage = currentPage + 1;
    const nextUrl = `https://xplate.com/en/numbers/license-plates?page=${nextPage}`;
    await enqueueLinks({ urls: [nextUrl] });
  },
  maxRequestsPerCrawl: 2000,
  maxConcurrency: 200,
});

await crawler.run(startUrls);

console.log("All Valid Plates:", validPlates.length, validPlates);
