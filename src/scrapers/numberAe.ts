import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { Plate } from "../types/plates.js";
import SELECTORS from "../config/selectors.js";
import { validatePlate } from "../validation/zod.js";

const carPlates: Plate[] = [];

const fetchPage = async (pageNumber: number): Promise<Plate[]> => {
  const url = `https://www.numbers.ae/plate/index?page=${pageNumber}&per-page=19`;
  const headers = SELECTORS.NUMBERS_AE.HEADERS;

  try {
    const response = await fetch(url, { method: "GET", headers });
    const html = await response.text();
    const $ = cheerio.load(html);

    const plates = Array.from(
      $('div[class="listings-container"] > div[class="row"] > div')
    );

    const validPlates = plates
      .map((plate) => {
        const plateElement = $(plate);
        const price =
          plateElement.find('div[class="col-sm-6 col-xs-12"]').text().trim() ||
          "";
        const link =
          plateElement.find('div[class="one-img"] > a').attr("href") || "";
        const img = plateElement.find("img").attr("src") || "";
        const altText = plateElement.find("img").attr("alt") || "";

        const altTextPart = altText.split("number ")[1];
        const character = altTextPart.charAt(0);
        const number = altTextPart.split(" ")[1];
        const duration = plateElement.find(".posted").text().trim();
        const emirate = altText.split("Plate")[0].trim();

        const newPlate: Plate = {
          img: "https://www.numbers.ae" + img,
          price: price,
          link: "https://www.numbers.ae" + link,
          character,
          number,
          duration,
          emirate,
          source: "number.ae",
        };

        const isItValidPlate = validatePlate(newPlate);

        if (isItValidPlate) {
          return newPlate;
        } else {
          console.error(
            "Plate with the following attributes is not valid: ",
            newPlate,
            "numberAe"
          );
          return undefined; // Explicitly return undefined for invalid plates
        }
      })
      .filter((plate): plate is Plate => plate !== undefined); // Filter out undefined values

    return validPlates;
  } catch (error) {
    console.error(`Error fetching page ${pageNumber}:`, error);
    return [];
  }
};

export const numbersRunner = async () => {
  let pageNumber = 0;
  let stop = false;
  let stoppedPageNumber = 0;

  while (!stop) {
    const batchPlates: Plate[] = [];

    for (let i = 0; i < 10; i++) {
      const pagePlates = await fetchPage(pageNumber);
      batchPlates.push(...pagePlates);
      pageNumber++;
    }

    const allExist = batchPlates.every((newPlate) =>
      carPlates.some(
        (plate) =>
          plate.character === newPlate.character &&
          plate.number === newPlate.number
      )
    );

    if (!allExist) {
      carPlates.push(
        ...batchPlates.filter(
          (newPlate) =>
            !carPlates.some(
              (plate) =>
                plate.character === newPlate.character &&
                plate.number === newPlate.number
            )
        )
      );
    } else {
      stop = true;
      stoppedPageNumber = pageNumber;
    }
  }
  console.log(`Stopped at page ${stoppedPageNumber}`);
  return carPlates;
};
