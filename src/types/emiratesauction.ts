interface plates {
  SharingLink: string;
  PlateNumber: string;
  PlateCode: string;
  Currency: string;
  CurrentPriceStr: string;
}

export interface emiratesauctionResponseData {
  Data: plates[];
}
