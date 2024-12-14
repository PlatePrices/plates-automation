export const getRequestConfig = (pageNumber: number) => {
  return {
    method: 'GET',
    url: `https://2020.ae/api/plates?limit=24&page=${pageNumber.toString()}&type_id=1&exclude_inactive=1`,
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.8',
      Origin: 'https://www.2020.ae',
      Priority: 'u=1, i',
      Referer: 'https://www.2020.ae/',
      'Sec-CH-UA': '"Chromium";v="128", "Not;A=Brand";v="24", "Brave";v="128"',
      'Sec-CH-UA-Mobile': '?0',
      'Sec-CH-UA-Platform': '"Linux"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
      'Sec-GPC': '1',
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    },
    redirect: 'follow',
  };
};

export const SELECTORS = {
  SOURCE_NAME: '2020',
  SHARABLE_LINK: 'https://www.2020.ae/en/buy/plates/',
};
