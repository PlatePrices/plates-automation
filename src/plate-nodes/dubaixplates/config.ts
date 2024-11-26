export const getRequestconfig = (pageNumber: number) => {
  pageNumber--;
  const startData = pageNumber * 8;
  const data = `getData=${startData.toString()}&start=0&limit=9`;

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://dubaixplates.com/en/loadmore_plate.php',
    headers: {
      accept: 'text/plain, */*; q=0.01',
      'accept-language': 'en-US,en;q=0.6',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      origin: 'https://dubaixplates.com',
      priority: 'u=1, i',
      referer: 'https://dubaixplates.com/en/plates',
      'sec-ch-ua': '"Brave";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Linux"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'sec-gpc': '1',
      'user-agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'x-requested-with': 'XMLHttpRequest',
    },
    data: data,
  };
  return config;
};

export const SELECTORS = {
  ALL_PLATES: 'div[class="col-lg-4"]',
  SHARABLE_LINK: 'https://dubaixplates.com/en/plates',
  PLATE_NUMBER: 'div > div > div > div:nth-child(2) > h1',
  PLATE_PRICE: 'h3[class="fontwt-600"]',
  PLATE_SOUCE: 'img',
  PLATE_EXCEPTION_SELECTOR: 'img[class="img-fluid"]',
  PLATE_CHARACTER: 'div > div > div > div:nth-child(1) > h1',
  PLATE_URL: 'a[class="btn btn-info"]',
};
