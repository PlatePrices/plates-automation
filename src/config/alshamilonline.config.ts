export const AL_SHAMIL_SELECTORS = {
    HEADERS: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,ar;q=0.7',
      'cache-control': 'max-age=0',
      cookie: 'ci_sessions=hq7701cs8rntt8777mqqq88kje0g1ggd',
      priority: 'u=0, i',
      'sec-ch-ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
    },
  
    URL: (pageNumber: number) => {
      return `https://www.alshamilonline.com/car-plates/${pageNumber}`;
    },
    SOURCE_NAME: 'alshamilonline',
    ALL_PLATES: 'div[class="col-sm-9 main-content-div temp-hide px-0"]',
    PRICE: ' div > a > div > div.col-xs-9.col-sm-8.mainprdspan > span:nth-child(3)',
    PLATE_LINK: 'a',
    IMAGE: 'a > img[class="post_imgs lazy"]',
    DATE: '.category-traderName .cat_udate',
  };