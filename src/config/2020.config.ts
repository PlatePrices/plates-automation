export const PLATES_2020_SELECTORS = {
  SOURCE_NAME: "2020",
  GET_URL: (pageNumber: number) =>  `https://2020.ae/api/plates?limit=24&page=${pageNumber}&type_id=1&exclude_inactive=1`,
  GET_REQUEST_OPTIONS: () => {
    const myHeaders = new Headers();
    myHeaders.append("accept", "application/json, text/plain, */*");
    myHeaders.append("accept-language", "en-US,en;q=0.8");
    myHeaders.append("origin", "https://www.2020.ae");
    myHeaders.append("priority", "u=1, i");
    myHeaders.append("referer", "https://www.2020.ae/");
    myHeaders.append(
      "sec-ch-ua",
      '"Chromium";v="128", "Not;A=Brand";v="24", "Brave";v="128"'
    );
    myHeaders.append("sec-ch-ua-mobile", "?0");
    myHeaders.append("sec-ch-ua-platform", '"Linux"');
    myHeaders.append("sec-fetch-dest", "empty");
    myHeaders.append("sec-fetch-mode", "cors");
    myHeaders.append("sec-fetch-site", "same-site");
    myHeaders.append("sec-gpc", "1");
    myHeaders.append(
      "user-agent",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    );

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    return requestOptions;
  },
  SHARABLE_LINK: "https://www.2020.ae/en/buy/plates/",
};
