export const AutoTraders_SELECTORS = {
  SOURCE_NAME: 'AutoTraders',
  URL: (pageNumber: number) => {
    return `https://www.autotraders.ae/numberplates?st=&city_id=&citycode_id=&number=&digit=All&page=${pageNumber}&limit=30`;
  },
  SHARABLE_LINK: 'https://www.autotraders.ae/numberplates',
  ALL_PLATES: 'div[class="col-md-4 col-sm-6 col-xs-6"]',
  PLATE: (plateNo: number) => {
    return `div:nth-child(${plateNo})`;
  },
  PLATE_LINK: 'a',
  PLATE_NUMBER: '#numbermb',
  PRICE:
    'div[class=numberplate-cont] > div[class=user-det]> ul > li:nth-child(1) > h3',

  CONFIG: {
    HEADERS: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,ar;q=0.7',
      'cache-control': 'max-age=0',
      cookie:
        'ci_session=p99v4en1bd67dajh39fg4eh61b1vimjo; ci_session=2d7ak9vru7edg5n64q4ko5aliig0tess',
      priority: 'u=0, i',
      referer: 'https://www.google.com/',
      'sec-ch-ua':
        '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'cross-site',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
    },
  },
};
