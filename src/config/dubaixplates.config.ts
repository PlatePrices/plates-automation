export const DUBAI_XPLATES_SELECTORS = {
  SOURCE_NAME: 'DUBAI_XPLATES',
  URL: 'https://dubaixplates.com/en/loadmore_plate.php',
  SHARABLE_LINK: 'https://dubaixplates.com/en/plates',
  GET_HEADERS: (): Headers => {
    const headers = new Headers();
    headers.append('accept', 'text/plain, */*; q=0.01');
    headers.append('accept-language', 'en-US,en;q=0.9');
    headers.append('content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
    headers.append(
      'cookie',
      '_gcl_au=1.1.348006559.1725358666; _ga=GA1.1.1454595071.1725358666; _ga_TTHFDBFKKV=GS1.1.1725358666.1.1.1725358670.0.0.0',
    );
    headers.append('origin', 'https://dubaixplates.com');
    headers.append('priority', 'u=1, i');
    headers.append('referer', 'https://dubaixplates.com/en/plates');
    headers.append('sec-ch-ua', '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"');
    headers.append('sec-ch-ua-mobile', '?0');
    headers.append('sec-ch-ua-platform', '"Linux"');
    headers.append('sec-fetch-dest', 'empty');
    headers.append('sec-fetch-mode', 'cors');
    headers.append('sec-fetch-site', 'same-origin');
    headers.append(
      'user-agent',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    );
    headers.append('x-requested-with', 'XMLHttpRequest');
    return headers;
  },

  GET_REQUEST_OPTIONS: (pageNumber: number): RequestInit => {
    return {
      method: 'POST',
      headers: DUBAI_XPLATES_SELECTORS.GET_HEADERS() as HeadersInit,
      body: `getData=1&start=${pageNumber}&limit=10`,
      redirect: 'follow',
    };
  },
  ALL_PLATES: 'div[class="col-lg-4"]',
  PLATE_NUMBER: 'div > div > div > div:nth-child(2) > h1',
  PLATE_PRICE: 'h3[class="fontwt-600"]',
  PLATE_SOUCE: 'img',
  PLATE_EXCEPTION_SELECTOR: 'img[class="img-fluid"]',
  PLATE_CHARACTER: 'div > div > div > div:nth-child(1) > h1',
  PLATE_URL: 'a[class="btn btn-info"]'
};
