const createNumbersAeConfig = (pageNumber) => {
    return {
      method: 'GET',
      url: `https://www.numbers.ae/plate/index?page=${pageNumber}&per-page=19`,
      headers: {
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
        'X-CSRF-Token':
          'ZmGFZnXUbRSd4EgwPgdJG--66Fa4L1qSqwOeIX-JWl4OVrckJuYlQNyCDXNYcARag9PfBcBXEdrtZPRzDfk8OA==',
        'X-Requested-With': 'XMLHttpRequest',
        'sec-ch-ua': '"Chromium";v="127", "Not)A;Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    };
  };
  
  import axios from 'axios';

(async () => {
  try {
    const config = createNumbersAeConfig(1); // Replace 1 with your desired page number
    const response = await axios(config);
    console.log('Data:', response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
})();
