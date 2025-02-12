export const PLATES_AE_SELECTORS = {
  SOURCE_NAME: 'platesae',
  HEADERS: {
    accept: '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    cookie:
      'PHPSESSID=ndv9mo0qfc7becn2esrn2m8vg0; _gcl_au=1.1.980843338.1723190935; _gid=GA1.2.680187602.1723393812; _gac_UA-90704945-1=1.1723461128.Cj0KCQjw5ea1BhC6ARIsAEOG5pzzz-oGPA_4Nkc0mbPiu9EPc4EcYMB8qznL0GqDngrTXHRZRnx9qo4aAtIgEALw_wcB; _gat=1; _gcl_aw=GCL.1723461128.Cj0KCQjw5ea1BhC6ARIsAEOG5pzzz-oGPA_4Nkc0mbPiu9EPc4EcYMB8qznL0GqDngrTXHRZRnx9qo4aAtIgEALw_wcB; _gcl_gs=2.1.k1^$i1723461127; _gat_UA-90704945-1=1; _ga=GA1.1.990426811.1723190934; _ga_XKJ3DQEC00=GS1.1.1723460973.5.1.1723461153.60.0.0; PHPSESSID=kj3qjqmv0ivdsjhou4qo54s9hm',
    dnt: '1',
    origin: 'https://www.plates.ae',
    priority: 'u=1, i',
    referer:
      'https://www.plates.ae/plates-en/plate.php?gad_source=1&gclid=Cj0KCQjw5ea1BhC6ARIsAEOG5pzzz-oGPA_4Nkc0mbPiu9EPc4EcYMB8qznL0GqDngrTXHRZRnx9qo4aAtIgEALw_wcB',
    'sec-ch-ua': '"Chromium";v="127", "Not)A;Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
    'x-requested-with': 'XMLHttpRequest',
  },
  BASE_URL: 'https://www.plates.ae/plates-en/loadmore_one_plate.php',
  ALL_PLATES: 'li > div.col-xl-12',
  PRICE: 'span.pricered',
  PLATE_NUMBER: '.plate_nub',
  CHARACTER: '.plate_code',
};
