export const getRequestConfig = (pageNumber: number) => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://www.numbers.ae/plate/index?page=2&per-page=${pageNumber}`,
    headers: {
      Accept: 'text/html, */*; q=0.01',
      'Accept-Language': 'en-US,en;q=0.5',
      Connection: 'keep-alive',
      Cookie:
        'PHPSESSID=ct7chbvh73pqppou6oo223vkrr; language=e6b6636a45c9370f36c37eaf375eedf6c2b3c04563ba4b73f1befe65d6e4aae1a%3A2%3A%7Bi%3A0%3Bs%3A8%3A%22language%22%3Bi%3A1%3Bs%3A5%3A%22en-US%22%3B%7D; _csrf=6d8c83ec41fbaec28cc110b7769bab921569a9f65106ca1153891c7996285d73a%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%225Zqwtg2nU7T3ggdKcQpuBMA9uwT5jSTw%22%3B%7D',
      Referer: 'https://www.numbers.ae/plate',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-GPC': '1',
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'X-CSRF-Token':
        'LC5wG2ZI_CBPfJTUFeKv_9ST9NidvSjNVvWOEpVT4GYZdAFsEi_OThpLwOdyhcu0t8KErd_wafQjgton_wC0EQ==',
      'X-Requested-With': 'XMLHttpRequest',
      'sec-ch-ua': '"Brave";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Linux"',
    },
  };

  return config;
};

export const SELECTORS = {
  ALL_PLATES: 'div[class="col-sm-9 main-content-div temp-hide px-0"]',
  PRICE:
    ' div > a > div > div.col-xs-9.col-sm-8.mainprdspan > span:nth-child(3)',
  PLATE_LINK: 'a',
  IMAGE: 'a > img[class="post_imgs lazy"]',
  DATE: '.category-traderName .cat_udate',
};
