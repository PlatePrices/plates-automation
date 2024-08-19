const XPLATES_SELECTORS = {
  SOURCE_NAME: 'xplate',
  ERROR_MESSAGE_SELECTOR: 'div.alert.alert-warning.text-center.m-0.rounded-3',
  ALL_PLATES: 'div.col-6.col-sm-4.my-1.p-1',
  PLATE_PRICE: 'span.custom-red.dm-white',
  PLATE_DURATION: 'div.d-flex.align-items-center.meta > div > span',
  PLATE_LINK: 'div.post.post-grid.rounded.bordered.p-1.h-100.dm-bordered > div > a',
  URL: 'https://xplate.com/en/numbers/license-plates?page=1',
 
  CONFIG : {
    method: 'GET',
    headers: { 
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7', 
      'accept-language': 'en-US,en;q=0.9', 
      'cookie': '_ga=GA1.1.1093613391.1722235085; _ga_G8NLN1FZ6Y=GS1.1.1723996871.13.1.1723997327.0.0.0; XSRF-TOKEN=eyJpdiI6ImhuRG5KODFFeE1yQ1B6WjBiV3FadXc9PSIsInZhbHVlIjoicHJyajhIanlud2R3L2VyQkVIMGpzVURKempZVWJuVDZPTStwTXBodkJPeHhKbVFKNVNyR2t2RTk4WGE0bzZBMUdxckJIZ2syd2xWVFltM0RpYXh0Y2tSOXl0VUh6MUJBcnk3U1dsZjZFZmV0TUMxeUtLMXRSZFl3SmVmbHZvN08iLCJtYWMiOiI5MjhjYzNkMzI3NmEzZGMzNGIxZDY4ZTVlZDlkNDEwMTRjOWVkZDAzNGM1ZDNhZDc0ZWNmYWZmNzgzMzkyNDE5IiwidGFnIjoiIn0%3D; xplate_session=eyJpdiI6ImNnRVBlSFZMZHhEemhjcy9JNHpjZ0E9PSIsInZhbHVlIjoiMnREM2JPV1pWSVhTVGNsNGhpMlBhVmpuSGkyWTBYZFN4dVVjbXJ5c2hZUTBxYzU3bjk4YWRyb2JwbnpCNTcyN3YyUERrK3Fsc0FxeHJpU1NmejFPUHRaTFdLR2t3Ym1GV2pqYWFHUWkyRnNOSVpRcmlwMUNuQXlLcGxSOG5WV2QiLCJtYWMiOiIwMDg1MTM2YWU2M2JiYWM3YmFlZmU3YjM0ZjFkNWYzMzY3YmY2NzE4MDVjN2FkNDVkYTU4M2EyNGQ0YWY3OGEyIiwidGFnIjoiIn0%3D; XSRF-TOKEN=eyJpdiI6Im1jWStHWUFZc0pHKzNjbDZHbFU5Rmc9PSIsInZhbHVlIjoiNXNXdFNlb3hkTkNrVlNUOE1CYk5ISGFsaVVsV0dWemxyK2UvY3ozNTVmWjNCNk1SS0xjZzJRS0dzRXhndG8zTTVHM011SWZ4QTR3eFR5c0JmdTdLYWVKZ1hiTCtnUURmNU80dU1HSVBzYjJ2ZmNyM01sZGhiU054aUg1clpMS3kiLCJtYWMiOiI1OTE4ZjQ1YmQ1N2E3NmY1YjQ0NmYxNDkxOTZhMWMzOTJjZjg2ZWUxMDgzMzZlYmRhOGMyMTg4MmIxNGUyNzcyIiwidGFnIjoiIn0%3D; xplate_session=eyJpdiI6IjlzTHZKZUhyRjJjRm0xL2VERC9RNFE9PSIsInZhbHVlIjoiT2RlZEZ6eGRxeGttVDdjL2hLeTNwU3M5dDZBVTRlOE5tUEpvd1NoSkNwRXhLT2NSVm1rVUE5dDVCaG42QmtMLzJEbGdBRUhHWjhJWGRPUmN1RWFTbFNVQ09qV2hZMkI4SHkrUWd4ZDB2dFZMOXY5UzJLanBCdGJ1eTVYSWxZTmgiLCJtYWMiOiIyZjAxNDI3Y2U4NWNkNTYyYzRmMTBlY2JkNTY1ODYxNTIwNjcwYzY3ZjY4OGVkYzFiNzhlY2E5NWJjNjUwZmVjIiwidGFnIjoiIn0%3D', 
      'dnt': '1', 
      'priority': 'u=0, i', 
      'sec-ch-ua': '"Chromium";v="127", "Not)A;Brand";v="99"', 
      'sec-ch-ua-mobile': '?0', 
      'sec-ch-ua-platform': '"Windows"', 
      'sec-fetch-dest': 'document', 
      'sec-fetch-mode': 'navigate', 
      'sec-fetch-site': 'none', 
      'sec-fetch-user': '?1', 
      'upgrade-insecure-requests': '1', 
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
    }
  }
};
export default XPLATES_SELECTORS;
