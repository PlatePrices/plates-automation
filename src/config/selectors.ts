const SELECTORS = {
  XPLATE: {
    ERROR_MESSAGE_SELECTOR: "div.alert.alert-warning.text-center.m-0.rounded-3",
    ALL_PLATES: "div.col-6.col-sm-4.my-1.p-1",
    PLATE_PRICE: "span.custom-red.dm-white",
    PLATE_DURATION: "div.d-flex.align-items-center.meta > div > span",
    PLATE_LINK:
      "div.post.post-grid.rounded.bordered.p-1.h-100.dm-bordered > div > a",
  },
  DUBIZZEL: {
    CONFIG: {
      HEADERS: {
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        Connection: "keep-alive",
        DNT: "1",
        Origin: "https://dubai.dubizzle.com",
        Referer: "https://dubai.dubizzle.com/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
        "Content-Type": "application/json",
      },
    },
  },
  EMIRATES_AUCTION: {
    HEADERS: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      authorization: "Bearer null",
      "content-type": "application/json",
      dnt: "1",
      lang: "en",
      origin: "https://www.emiratesauction.com",
      referer: "https://www.emiratesauction.com/",
      "sec-ch-ua": '"Chromium";v="127", "Not)A;Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      source: "web",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    },
  },
  PLATES_AE: {
    HEADERS: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      cookie:
        "PHPSESSID=ndv9mo0qfc7becn2esrn2m8vg0; _gcl_au=1.1.980843338.1723190935; _gid=GA1.2.680187602.1723393812; _gac_UA-90704945-1=1.1723461128.Cj0KCQjw5ea1BhC6ARIsAEOG5pzzz-oGPA_4Nkc0mbPiu9EPc4EcYMB8qznL0GqDngrTXHRZRnx9qo4aAtIgEALw_wcB; _gat=1; _gcl_aw=GCL.1723461128.Cj0KCQjw5ea1BhC6ARIsAEOG5pzzz-oGPA_4Nkc0mbPiu9EPc4EcYMB8qznL0GqDngrTXHRZRnx9qo4aAtIgEALw_wcB; _gcl_gs=2.1.k1^$i1723461127; _gat_UA-90704945-1=1; _ga=GA1.1.990426811.1723190934; _ga_XKJ3DQEC00=GS1.1.1723460973.5.1.1723461153.60.0.0; PHPSESSID=kj3qjqmv0ivdsjhou4qo54s9hm",
      dnt: "1",
      origin: "https://www.plates.ae",
      priority: "u=1, i",
      referer:
        "https://www.plates.ae/plates-en/plate.php?gad_source=1&gclid=Cj0KCQjw5ea1BhC6ARIsAEOG5pzzz-oGPA_4Nkc0mbPiu9EPc4EcYMB8qznL0GqDngrTXHRZRnx9qo4aAtIgEALw_wcB",
      "sec-ch-ua": '"Chromium";v="127", "Not)A;Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
      "x-requested-with": "XMLHttpRequest",
    },

    ALL_PLATES: "li > div.col-xl-12",
    PRICE: "span.pricered",
    PLATE_NUMBER: ".plate_nub",
    CHARACTER: ".plate_code",
  },
};
export default SELECTORS;
