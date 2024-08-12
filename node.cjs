const axios = require('axios');
let data = JSON.stringify({
  "PlateFilterRequest": {
    "PlateTypeIds": {
      "Filter": [],
      "IsSelected": false
    },
    "PlateNumberDigitsCount": {
      "Filter": [],
      "IsSelected": false
    },
    "Codes": {
      "Filter": [],
      "IsSelected": false
    },
    "EndDates": {
      "Filter": [],
      "IsSelected": false
    },
    "Prices": {
      "From": "",
      "To": ""
    },
    "AuctionTypeId": 23
  },
  "PageSize": 100,
  "PageIndex": 0,
  "IsDesc": false
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://apiv8.emiratesauction.net/api/PlatesBuyNow',
  headers: { 
    'accept': 'application/json, text/plain, */*', 
    'accept-language': 'en-US,en;q=0.9', 
    'authorization': 'Bearer null', 
    'content-type': 'application/json', 
    'dnt': '1', 
    'lang': 'en', 
    'origin': 'https://www.emiratesauction.com', 
    'priority': 'u=1, i', 
    'referer': 'https://www.emiratesauction.com/', 
    'sec-ch-ua': '"Chromium";v="127", "Not)A;Brand";v="99"', 
    'sec-ch-ua-mobile': '?0', 
    'sec-ch-ua-platform': '"Windows"', 
    'sec-fetch-dest': 'empty', 
    'sec-fetch-mode': 'cors', 
    'sec-fetch-site': 'cross-site', 
    'source': 'web', 
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data["Data"][0]));
})
.catch((error) => {
  console.log(error);
});


