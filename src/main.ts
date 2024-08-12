import { dubizzelRunner } from "./scrapers/dubizzel.js";
import { emiratesAuctionRunner } from "./scrapers/emiratesauction.js";
import { platesAeRunner } from "./scrapers/plates.js";
import { xplateRunner } from "./scrapers/xplate.js";
import { Plate } from "./types/plates.js";

const extractAllPlates = async (): Promise<Plate[]> => {
  const plateGroups = await Promise.all([
    dubizzelRunner(),
    emiratesAuctionRunner(),
    // xplateRunner(),
    platesAeRunner(),
  ]);

  const allPlates: Plate[] = [];
  for (const plateGroup of plateGroups) {
    for (const plate of plateGroup) {
      allPlates.push(plate);
    }
  }

  return allPlates;
};

console.log(await extractAllPlates());