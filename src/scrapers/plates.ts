import fetch from "node-fetch"; // Make sure to install node-fetch if you haven't already
import * as cheerio from "cheerio";
import { Plate } from "../types/plates.js";
import SELECTORS from "../config/selectors.js";
import { validatePlate } from "../validation/zod.js";

const baseUrl = "https://www.plates.ae/plates-en/loadmore_one_plate.php";

const carPlates: Plate[] = [];

const fetchPage = async (page: number): Promise<boolean> => {
  const data = `page=${page}`;
  const headers = SELECTORS.PLATES_AE.HEADERS;

  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: headers,
      body: data,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const plates = Array.from($(SELECTORS.PLATES_AE.ALL_PLATES));
    if (plates.length === 0) {
      return false;
    }

    plates.forEach((plate) => {
      const plateElement = $(plate);
      const price =
        plateElement.find(SELECTORS.PLATES_AE.PRICE).text().trim() || "";
      const link = plateElement.find("a").attr("href") || "";
      const contact = plateElement.find("a").attr("href")?.slice(4, 15) || "";
      const number =
        plateElement.find(SELECTORS.PLATES_AE.PLATE_NUMBER).text().trim() || "";
      const character =
        plateElement.find(SELECTORS.PLATES_AE.CHARACTER).text().trim() || "";
      const img = plateElement.find("img").attr("src") || "";

      const newPlate: Plate = {
        link,
        price,
        contact,
        number,
        character,
        img,
        source: "plates.ae"
      };
      const isItValidPlate = validatePlate(newPlate);

      if (isItValidPlate) {
        carPlates.push(newPlate);
      } else {
        console.log(
          "Plate with the following attributes is not valid: ",
          newPlate,
          "platesAe"
        );
      }
    });

    return true;
  } catch (error) {
    console.error("Error fetching page:", error);
    return false;
  }
};

export const platesAeRunner = async () => {
  let page = 0;
  let hasMorePages = true;

  while (hasMorePages) {
    hasMorePages = await fetchPage(page);
    page++;
  }
  return carPlates;
};
