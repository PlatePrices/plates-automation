export const getRequestConfig = (pageNumber: number) => ({
  method: 'GET', // Assuming it's a GET request
  url: `https://www.alshamilonline.com/car-plates/${pageNumber.toString()}`,
  headers: {
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8,ar;q=0.7',
    'Cache-Control': 'max-age=0',
    Cookie: 'ci_sessions=hq7701cs8rntt8777mqqq88kje0g1ggd',
    Priority: 'u=0, i',
    'Sec-CH-UA':
      '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
    'Sec-CH-UA-Mobile': '?0',
    'Sec-CH-UA-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
  },
});

export const SELECTORS = {
  ALL_PLATES: 'div[class="col-sm-4 catpostimgs"]',
  PRICE:
    ' div > a > div > div.col-xs-9.col-sm-8.mainprdspan > span:nth-child(3)',
  PLATE_LINK: 'a',
  IMAGE: 'a > img[class="post_imgs lazy"]',
  DATE: '.category-traderName .cat_udate',
  SOURCE: 'ALSHAMSIONLINE',
};
