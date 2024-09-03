const myHeaders = new Headers();
myHeaders.append("accept", "text/plain, */*; q=0.01");
myHeaders.append("accept-language", "en-US,en;q=0.9");
myHeaders.append("content-type", "application/x-www-form-urlencoded; charset=UTF-8");
myHeaders.append("cookie", "_gcl_au=1.1.348006559.1725358666; _ga=GA1.1.1454595071.1725358666; _ga_TTHFDBFKKV=GS1.1.1725358666.1.1.1725358670.0.0.0");
myHeaders.append("origin", "https://dubaixplates.com");
myHeaders.append("priority", "u=1, i");
myHeaders.append("referer", "https://dubaixplates.com/en/plates");
myHeaders.append("sec-ch-ua", "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Google Chrome\";v=\"128\"");
myHeaders.append("sec-ch-ua-mobile", "?0");
myHeaders.append("sec-ch-ua-platform", "\"Linux\"");
myHeaders.append("sec-fetch-dest", "empty");
myHeaders.append("sec-fetch-mode", "cors");
myHeaders.append("sec-fetch-site", "same-origin");
myHeaders.append("user-agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36");
myHeaders.append("x-requested-with", "XMLHttpRequest");

const raw = "getData=1&start=8&limit=10";

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://dubaixplates.com/en/loadmore_plate.php", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));