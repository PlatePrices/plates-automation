import { CheerioCrawler } from "crawlee";
import SELECTORS from "../config/selectors.js";
import { Plate } from "../types/plates.js";
import { validatePlate } from "../validation/zod.js";

const startUrls = ["https://xplate.com/en/numbers/license-plates?page=0"];

const carPlates: Plate[] = [];

const crawler = new CheerioCrawler({
  requestHandler: async ({ $, request, log, enqueueLinks }) => {
    log.info(`Scraping ${request.url}`);

    if ($(SELECTORS.XPLATE.ERROR_MESSAGE_SELECTOR).length) {
      log.info(
        `This is the last page, there is not plates in this page ${request.url}, stop scraping.`
      );
      return;
    }
    // reminder: I excluded the first element since it is not a plate
    const plates = Array.from($(SELECTORS.XPLATE.ALL_PLATES)).slice(1);

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
        plateElement.find(SELECTORS.XPLATE.PLATE_PRICE).text().trim() || "";
      const duration =
        plateElement.find(SELECTORS.XPLATE.PLATE_DURATION).text().trim() || "";
      const link =
        plateElement.find(SELECTORS.XPLATE.PLATE_LINK).attr("href") || "";

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
        source: 'xplate'
      };

      if (
        Object.values(plateObj).every(
          (value) => value && value !== "featured" && value !== ""
        )
      ) {
        carPlates.push(plateObj);
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

export const xplateRunner = async (): Promise<Plate[]> => {
  await crawler.run(startUrls);
  const validPlates: Plate[] = [];
  for (const plate of carPlates) {
    const isItValidPlate = await validatePlate(plate);

    if (isItValidPlate) {
      validPlates.push(plate);
    } else {
      console.log(
        "Plate with the following attributes is not valid: ",
        plate,
        "xplate"
      );
    }
  }
  return validPlates;
};
