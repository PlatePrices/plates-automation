// not all attributes can exist in all scrapers so  I added the question mark just in case:

export type Plate = {
  url?: string;
  image?: string;
  duration?: string;
  price?: string;
  emirate?: string;
  character?: string;
  number?: number;
  contact?: string;
  source: string;
};

// these are needed as the key for each emirate according the body in the request
export const emirates = {
  SHARJAH: 23,
  AJMAN: 27,
  RAS_AL_KHAIMAH: 16,
  FUJAIRAH: 14,
};

export type invalidPlatesInfo = {
  isValid: boolean;
  data: Plate;
};

export type validAndInvalidPlates = {
  validPlates: Plate[];
  invalidPlates: Plate[];
};
