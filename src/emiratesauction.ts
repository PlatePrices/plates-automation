import axios from "axios";
import getImageFromEmirate from "./imagExtractor.js";

type Plate = {
  link: string;
  img: string;
  price: string;
  emirate: string;
  character: string;
  number: number;
};

const emirates = {
  SHARJAH: 23,
  AJMAN: 27,
  RAS_AL_KHAIMAH: 16,
  FUJAIRAH: 14,
};

const fetchPlateData = async () => {
  const results: Plate[] = [];

  for (const [emirateName, emirateId] of Object.entries(emirates)) {
    const data = JSON.stringify({
      PlateFilterRequest: {
        PlateTypeIds: {
          Filter: [],
          IsSelected: false,
        },
        PlateNumberDigitsCount: {
          Filter: [],
          IsSelected: false,
        },
        Codes: {
          Filter: [],
          IsSelected: false,
        },
        EndDates: {
          Filter: [],
          IsSelected: false,
        },
        Prices: {
          From: "",
          To: "",
        },
        AuctionTypeId: emirateId,
      },
      PageSize: 100,
      PageIndex: 0,
      IsDesc: false,
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://apiv8.emiratesauction.net/api/PlatesBuyNow",
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        authorization: "Bearer null",
        "content-type": "application/json",
        dnt: "1",
        lang: "en",
        origin: "https://www.emiratesauction.com",
        referer: "https://www.emiratesauction.com/",
        "sec-ch-ua": '"Chromium";v="127", "Not)A;Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        source: "web",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      const carPlates = response.data["Data"];

      for (const carPlate of carPlates) {
        const link = carPlate["SharingLink"];
        const number = carPlate["PlateNumber"];
        const img = await getImageFromEmirate(number);
        const character = carPlate["PlateCode"];
        const price = carPlate["Currency"] + " " + carPlate["CurrentPriceStr"];

        results.push({
          link,
          number,
          img: img ? img : "",
          character,
          price,
          emirate: emirateName,
        });
      }
    } catch (error) {
      console.error(`Error fetching plate data for ${emirateName}: ${error}`);
    }
  }

  console.log(results.length);
};

fetchPlateData();
