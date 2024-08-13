import { connectToDb } from "./Database/connection.js";
import { dubizzelRunner } from "./scrapers/dubizzel.js";
import { emiratesAuctionRunner } from "./scrapers/emiratesauction.js";
import { numbersRunner } from "./scrapers/numberAe.js";
import { platesAeRunner } from "./scrapers/plates.js";
import { xplateRunner } from "./scrapers/xplate.js";
import { Plate } from "./types/plates.js";
import { plate } from "./Database/schemas/plates.schema.js";
import dotenv from "dotenv";
dotenv.config();

const extractAllPlates = async (): Promise<Plate[]> => {
  await connectToDb();
  const plateGroups = await Promise.all([
    dubizzelRunner(),
    emiratesAuctionRunner(),
    xplateRunner(),
    platesAeRunner(),
    numbersRunner(),
  ]);

  const allPlates: Plate[] = [];
  for (const plateGroup of plateGroups) {
    for (const plate of plateGroup) {
      allPlates.push(plate);
    }
  }

  return allPlates;
};

const savePlatesToDb = async (plates: Plate[]) => {
  try {
    await plate.insertMany(plates);
    console.log("all plates have been saved");
  } catch (error) {
    console.error("Error saving plates to database:", error);
  }
};

const run = async () => {
  const plates = await extractAllPlates();
  await savePlatesToDb(plates);
};

run();
