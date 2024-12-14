export const getRequestConfig = (pageNumber: number) => {
  return {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://xplate.com/en/numbers/license-plates?page=${pageNumber.toString()}`,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:132.0) Gecko/20100101 Firefox/132.0',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      Connection: 'keep-alive',
      Referer: 'https://xplate.com/en/numbers/license-plates',
      Cookie:
        '_ga_G8NLN1FZ6Y=GS1.1.1731906087.6.0.1731906096.0.0.0; _ga=GA1.1.1456603131.1727282597; XSRF-TOKEN=eyJpdiI6ImdtTzNONWt3NGsvaHRlK3ZsMFJCYXc9PSIsInZhbHVlIjoiWEc4dzdYbmpoWjZVVGt1bWdqTlhQU2ExUE0xSnZoMGhhSVRjR1dkbFIyek5nK0VWR3dLdWZ3bVUyWVJ4eUYzc3RTOE9OSjE2cWQ5VUZOR3FDL3BGY2IrRjRaZEd6T0pmWStxeTVMYW1uRXdzcFJkVHZQOWhNSjExZUpZU01DVVQiLCJtYWMiOiJhZWE0ODIyYzg4NDY1MjZkMDQ0MjcwM2YzZmM2NGY0YjIwMzQyNjE4Yjg0NTMzNThkNDk0NTU0NjgxNjBhMzJhIiwidGFnIjoiIn0%3D; xplate_session=eyJpdiI6InZ4K21RN1BLaHhGeFo0SDJHSnd2ZWc9PSIsInZhbHVlIjoiViswZkQ3eUtnR28veWFBTFpZVUM3RkJWaVozb2NvdjNjSUtDWkZ4RzMxZkNkc210NkVpSEpXVFBPcUFMeG1ZaWpMZ2p4dm5jdVB5V1JpS0kxbzVBOXg0cllXYXpXNE1ib2FMUDNPMGpCL253SEpwc0drZm5zaUVwWDJ2WGgxa0wiLCJtYWMiOiI1ZGQwOTEyM2VlZGI2MmRhYzk3OGEwNzU4MjEwNmQ1MWRhNWY1M2VlY2M2YTM2NzhmM2E2ZTc0YjAxOThlMjlmIiwidGFnIjoiIn0%3D; XSRF-TOKEN=eyJpdiI6InN2SVpxb2Z1N2hDdEgrdEQydzlJcVE9PSIsInZhbHVlIjoiYWhNVGVhUmJEdndxcytFU2twUzZrcWYvZm9sMUgwRlFZS0dSc29XSGtmbk11YXBUYTU3eHJ3eTd2cU5YdXRGUVNQZjV0OElENTZFMzc3K0lZekZQWVRzMlFJWUJzeUd1SFU0S1Z1dXo1UHFuN0JsYWhTeituUzlhbUFyOXVxYlgiLCJtYWMiOiI3MzVhZmYxYjA1MTIwNGNkZjg2NDQyMzViMjM5NTcxNTI0MWJiZTY2ODFjOGFlODcyZjA1M2E1YTBmNTM5OWU2IiwidGFnIjoiIn0%3D; xplate_session=eyJpdiI6IndHRVpWYnBJWkFwQTByMzVPOEEzV1E9PSIsInZhbHVlIjoiTjU1QUZJaDl1YlN5MEIzdm80amxwc01Ba3JBbk5pd0M5dGt6L2E5ekFLdUEvZ3g4K1BRYm5LNkxWbDBPeTkxMC8zcW5SN1RtQzJFcC80V29VeVUwVENlVGVvOG5GL3pvRTJ6SVh4Q09lK2RDNEx6T2Y2WXFFU1pEUjJFc2pZRlQiLCJtYWMiOiIyNDk5MjY3MDU0ZjQ3YTk1M2IzYzZkYzJiMDUwMmY3YzJjZmUxMWUxYmRhNzQ4ZTQwY2RiYjljNDM1YjE3NTI0IiwidGFnIjoiIn0%3D',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-User': '?1',
      Priority: 'u=0, i',
      TE: 'trailers',
    },
  };
};

export const SELECTORS = {
  ALL_PLATES: 'div[class="col-6 col-sm-4 my-1 p-1"]',
  WARNING_MESSAGE: 'div[class="alert alert-warning text-center m-0 rounded-3"]',
  PRICE: 'span[class="custom-red dm-white"]',
  DURATION: 'div[class="d-flex align-items-center meta"] > div:not([class])',
  LINK: 'div.post.post-grid.rounded.bordered.p-1.h-100.dm-bordered > div > a',
  SOURCE: 'XPLATE',
};
