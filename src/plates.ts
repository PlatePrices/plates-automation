import axios, { AxiosRequestConfig } from "axios";
import * as cheerio from "cheerio";

const baseUrl = "https://www.plates.ae/plates-en/loadmore_one_plate.php";
type Plate = {
  link?: string;
  img?: string;
  duration?: string;
  price?: string;
  emirate?: string;
  character?: string;
  number?: string;
  contact?: string;
};
const carPlates: Plate[] = [];

const fetchPage = async (page: number) => {
  const data = `page=${page}`;
  const config: AxiosRequestConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: baseUrl,
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      cookie:
        "PHPSESSID=ndv9mo0qfc7becn2esrn2m8vg0; _gcl_au=1.1.980843338.1723190935; _gid=GA1.2.680187602.1723393812; _gac_UA-90704945-1=1.1723461128.Cj0KCQjw5ea1BhC6ARIsAEOG5pzzz-oGPA_4Nkc0mbPiu9EPc4EcYMB8qznL0GqDngrTXHRZRnx9qo4aAtIgEALw_wcB; _gat=1; _gcl_aw=GCL.1723461128.Cj0KCQjw5ea1BhC6ARIsAEOG5pzzz-oGPA_4Nkc0mbPiu9EPc4EcYMB8qznL0GqDngrTXHRZRnx9qo4aAtIgEALw_wcB; _gcl_gs=2.1.k1^$i1723461127; _gat_UA-90704945-1=1; _ga=GA1.1.990426811.1723190934; _ga_XKJ3DQEC00=GS1.1.1723460973.5.1.1723461153.60.0.0; PHPSESSID=kj3qjqmv0ivdsjhou4qo54s9hm",
      dnt: "1",
      origin: "https://www.plates.ae",
      priority: "u=1, i",
      referer:
        "https://www.plates.ae/plates-en/plate.php?gad_source=1&gclid=Cj0KCQjw5ea1BhC6ARIsAEOG5pzzz-oGPA_4Nkc0mbPiu9EPc4EcYMB8qznL0GqDngrTXHRZRnx9qo4aAtIgEALw_wcB",
      "sec-ch-ua": '"Chromium";v="127", "Not)A;Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
      "x-requested-with": "XMLHttpRequest",
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    const html = response.data;
    const $ = cheerio.load(html);

    const plates = Array.from($("li > div.col-xl-12"));
    if (plates.length === 0) {
      console.log("No more plates available.");
      return false;
    }

    plates.forEach((plate) => {
      const plateElement = $(plate);
      const price = plateElement.find("span.pricered").text().trim() || "";
      const link = plateElement.find("a").attr("href") || "";
      const contact = plateElement.find("a").attr("href")?.slice(4, 15) || "";
      const number = plateElement.find(".plate_nub").text().trim() || "";
      const character = plateElement.find(".plate_code").text().trim() || "";
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

const scrapeAllPages = async () => {
  let page = 0;
  let hasMorePages = true;

  while (hasMorePages) {
    console.log(`Fetching page ${page}...`);
    hasMorePages = await fetchPage(page);
    page++;
  }

  console.log("Scraping complete.");
  console.log(carPlates);
};

scrapeAllPages();
