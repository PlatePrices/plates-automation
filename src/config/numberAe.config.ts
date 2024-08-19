export const NUMBERS_AE_SELECTORS = {
  HEADERS: {
    Accept: 'text/html, */*; q=0.01',
    'Accept-Language': 'en-US,en;q=0.9',
    Connection: 'keep-alive',
    DNT: '1',
    Referer: 'https://www.numbers.ae/plate',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
    'X-CSRF-Token': 'ZmGFZnXUbRSd4EgwPgdJG--66Fa4L1qSqwOeIX-JWl4OVrckJuYlQNyCDXNYcARag9PfBcBXEdrtZPRzDfk8OA==',
    'X-Requested-With': 'XMLHttpRequest',
    'sec-ch-ua': '"Chromium";v="127", "Not)A;Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
  },
  ALL_PLATES: 'div[class="listings-container"] > div[class="row"] > div',
  PRICE: 'div[class="col-sm-6 col-xs-12"]',
  LINK: 'div[class="one-img"] > a',
  SHARABLE_LINK: 'https://www.numbers.ae',
  SOURCE_NAME: 'numberae',
  URL: (pageNumber: number) => {
    return `https://www.numbers.ae/plate/index?page=${pageNumber.toString()}&per-page=19`;
  },
};
