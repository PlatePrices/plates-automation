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
  extractImage: async (plateNumber: number): Promise<string | null> => {
    const url = `https://cdn.emiratesauction.com/PLATES/shns/300/3/${plateNumber.toString()}.png`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          accept:
            'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'accept-language': 'en-US,en;q=0.9',
          cookie:
            '_gcl_au=1.1.587635204.1723190891; _ga=GA1.1.1889851531.1723190892; _tt_enable_cookie=1; _ttp=UeDxIAFbd0XLJJCWdN4M6kexq9M; _scid=ed2aa0e8-1c17-4002-9c2f-0b24590c1aef; _fbp=fb.1.1723190891910.41171373912990140; _sctr=1%7C1723147200000; _hjSessionUser_3520498=eyJpZCI6ImQ5OTk2M2QxLWZjZGQtNWE5YS1hMjIxLWI5NmE4MWQ1YmFjZSIsImNyZWF0ZWQiOjE3MjMxOTA4OTA4MjIsImV4aXN0aW5nIjp0cnVlfQ==; _gcl_aw=GCL.1723393615.CjwKCAjw_Na1BhAlEiwAM-dm7DlUuFI_wtmzz7dM5Al0EvCZ7pi84lXEJTm-VrBMzQdticrAtRWNIxoCw9IQAvD_BwE; _gcl_gs=2.1.k1^$i1723393612; _hjSession_3520498=eyJpZCI6IjVkZTYyM2Q3LTZlZDctNGZiYS05NmFmLTc0Y2I0Nzk1OWZmZCIsImMiOjE3MjM0NTEwODY5NzcsInMiOjEsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowfQ==; _scid_r=ed2aa0e8-1c17-4002-9c2f-0b24590c1aef; _ga_RT9V7SDSH0=GS1.1.1723451079.5.1.1723451369.55.0.229960391',
          dnt: '1',
          'if-modified-since': 'Sun, 11 Aug 2024 20:36:50 GMT',
          priority: 'i',
          referer: 'https://www.emiratesauction.com/',
          'sec-ch-ua': '"Chromium";v="127", "Not)A;Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'image',
          'sec-fetch-mode': 'no-cors',
          'sec-fetch-site': 'same-site',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status.toString()}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer).toString('base64');
    } catch (error) {
      console.error('Error downloading the image:', error);
      return null;
    }
  },
};
