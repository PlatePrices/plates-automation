export const EMIRATES_AUCTION_SELECTORS = {
  SOURCE_NAME: 'emiratesauction',
  URL: 'https://apiv8.emiratesauction.net/api/PlatesBuyNow',
  HEADERS: {
    accept: 'application/json, text/plain, */*',
    'accept-language': 'en-US,en;q=0.9',
    authorization: 'Bearer null',
    'content-type': 'application/json',
    dnt: '1',
    lang: 'en',
    origin: 'https://www.emiratesauction.com',
    referer: 'https://www.emiratesauction.com/',
    'sec-ch-ua': '"Chromium";v="127", "Not)A;Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    source: 'web',
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
  },
  // each emirate has auctionTypeId so this data changes according to specifics ids which represents the emirate
  DATA: (emirateId: number) => {
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
          From: '',
          To: '',
        },
        AuctionTypeId: emirateId,
      },
      PageSize: 100,
      PageIndex: 0,
      IsDesc: false,
    });
    return data;
  },
};
