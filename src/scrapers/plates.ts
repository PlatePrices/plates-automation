import axios, { AxiosRequestConfig } from "axios";
import * as cheerio from "cheerio";
import { Plate } from "../types/plates.js";
import SELECTORS from "../config/selectors.js";

const baseUrl = "https://www.plates.ae/plates-en/loadmore_one_plate.php";

const carPlates: Plate[] = [];

const fetchPage = async (page: number) => {
  const data = `page=${page}`;
  const config: AxiosRequestConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: baseUrl,
    headers: SELECTORS.PLATES_AE.HEADERS,
    data: data,
  };

  try {
    const response = await axios.request(config);
    const html = response.data;
    const $ = cheerio.load(html);

    const plates = Array.from($(SELECTORS.PLATES_AE.ALL_PLATES));
    if (plates.length === 0) {
      return false;
    }

    plates.forEach((plate) => {
      const plateElement = $(plate);
      const price = plateElement.find(SELECTORS.PLATES_AE.PRICE).text().trim() || "";
      const link = plateElement.find("a").attr("href") || "";
      const contact = plateElement.find("a").attr("href")?.slice(4, 15) || "";
      const number = plateElement.find(SELECTORS.PLATES_AE.PLATE_NUMBER).text().trim() || "";
      const character = plateElement.find(SELECTORS.PLATES_AE.CHARACTER).text().trim() || "";
      const img = plateElement.find("img").attr("src") || "";

      carPlates.push({
        link: link,
        price: price,
        contact: contact,
        number: number,
        character: character,
        img: img,
      });
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


