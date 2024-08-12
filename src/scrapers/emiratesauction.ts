import axios from "axios";
import getImageFromEmirate from "../utils/imagExtractor.js";
import { Plate } from "../types/plates.js";
import SELECTORS from "../config/selectors.js";

const emirates = {
  SHARJAH: 23,
  AJMAN: 27,
  RAS_AL_KHAIMAH: 16,
  FUJAIRAH: 14,
};

export const emiratesAuctionRunner = async (): Promise<Plate []> => {
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
      headers: SELECTORS.EMIRATES_AUCTION.HEADERS,
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

  return results;
};


