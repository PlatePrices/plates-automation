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
    DATA: (emirateId: number) => {
      const data = JSON.stringify({
        PlateFilterRequest: {
          PlateTypeIds: {
            Filter: [],
            IsSelected: false,
          },
          PlateNumberDigitsCount: {
            Filter: [],
            IsSelected: false,
          },
          Codes: {
            Filter: [],
            IsSelected: false,
          },
          EndDates: {
            Filter: [],
            IsSelected: false,
          },
          Prices: {
            From: "",
            To: "",
          },
          AuctionTypeId: emirateId,
        },
        PageSize: 100,
        PageIndex: 0,
        IsDesc: false,
      });
      return data;
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
    BASE_URL: "https://www.plates.ae/plates-en/loadmore_one_plate.php",
    ALL_PLATES: "li > div.col-xl-12",
    PRICE: "span.pricered",
    PLATE_NUMBER: ".plate_nub",
    CHARACTER: ".plate_code",
  },
  NUMBERS_AE: {
    HEADERS: {
      Accept: "text/html, */*; q=0.01",
      "Accept-Language": "en-US,en;q=0.9",
      Connection: "keep-alive",
      Cookie:
        "PHPSESSID=qkedaruvrba8s9h7c930drcjli; language=e6b6636a45c9370f36c37eaf375eedf6c2b3c04563ba4b73f1befe65d6e4aae1a%3A2%3A%7Bi%3A0%3Bs%3A8%3A%22language%22%3Bi%3A1%3Bs%3A5%3A%22en-US%22%3B%7D; _csrf=711dcab117928f3929ed379afd9858785183fbb8f6a3a495a3a412242a21e74aa%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22h72BS2HTAbECfwMAli7SxxKHFgjRrpff%22%3B%7D; _gid=GA1.2.709611335.1723518278; _ym_uid=1723518279255961743; _ym_d=1723518279; _ym_isad=1; _ym_visorc=w; _gat_gtag_UA_49597849_1=1; _gat=1; _ga_JB4FEQRP8E=GS1.1.1723518277.1.1.1723518379.0.0.0; _ga=GA1.1.1364818131.1723518278",
      DNT: "1",
      Referer: "https://www.numbers.ae/plate",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
      "X-CSRF-Token":
        "ZmGFZnXUbRSd4EgwPgdJG--66Fa4L1qSqwOeIX-JWl4OVrckJuYlQNyCDXNYcARag9PfBcBXEdrtZPRzDfk8OA==",
      "X-Requested-With": "XMLHttpRequest",
      "sec-ch-ua": '"Chromium";v="127", "Not)A;Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
    },
    ALL_PLATES: 'div[class="listings-container"] > div[class="row"] > div',
    PRICE: 'div[class="col-sm-6 col-xs-12"]',
    LINK: 'div[class="one-img"] > a',
    SHARABLE_LINK: "https://www.numbers.ae",
    SOURCE_NAME: "number.ae",
  },
};
export default SELECTORS;
