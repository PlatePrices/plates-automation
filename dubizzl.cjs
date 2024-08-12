const axios = require('axios');
let data = JSON.stringify({
  "requests": [
    {
      "indexName": "motors.com",
      "query": "",
      "params": "page=4&attributesToHighlight=[]&hitsPerPage=25&attributesToRetrieve=[\"is_premium\",\"is_featured_agent\",\"location_list\",\"objectID\",\"name\",\"price\",\"neighbourhood\",\"agent_logo\",\"can_chat\",\"has_whatsapp_number\",\"details\",\"photo_thumbnails\",\"photos\",\"highlighted_ad\",\"absolute_url\",\"id\",\"category_id\",\"uuid\",\"category\",\"has_phone_number\",\"category_v2\",\"photos_count\",\"created_at\",\"site\",\"permalink\",\"has_vin\",\"auto_agent_id\",\"is_trusted_seller\",\"show_trusted_seller_logo\",\"trusted_seller_logo\",\"trusted_seller_id\",\"created_at\",\"added\",\"jobs_logo\",\"vas\",\"seller_type\",\"is_verified_user\",\"has_video\",\"cotd_on\",\"is_super_ad\",\"categories\",\"city\",\"bedrooms\",\"bathrooms\",\"size\",\"neighborhoods\",\"agent\",\"room_type\",\"is_reserved\",\"is_coming_soon\",\"inventory_type\"]&filters=(\"category_v2.slug_paths\":\"motors/number-plates\") AND (\"site.id\":\"2\" OR \"multi_site\":true)"
    }
  ]
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://wd0ptz13zs-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.11.0);%20Browser%20(lite)&x-algolia-api-key=cef139620248f1bc328a00fddc7107a6&x-algolia-application-id=WD0PTZ13ZS',
  headers: { 
    'Accept': '*/*', 
    'Accept-Language': 'en-US,en;q=0.9', 
    'Connection': 'keep-alive', 
    'DNT': '1', 
    'Origin': 'https://dubai.dubizzle.com', 
    'Referer': 'https://dubai.dubizzle.com/', 
    'Sec-Fetch-Dest': 'empty', 
    'Sec-Fetch-Mode': 'cors', 
    'Sec-Fetch-Site': 'cross-site', 
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36', 
    'Content-Type': 'application/json'
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
