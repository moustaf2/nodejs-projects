const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate.js");
// .......... File ..............//

// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is what we know about the avocadoe:`;
// fs.writeFileSync("./txt/output.txt", textOut);

// // console.log("file written");

// fs.readFile("./txt/text.txt", "utf-8", (err, data) => {
//   console.log(data);

//   fs.writeFile("./txt/new.txt", `${data}`, "utf-8", (err) => {
//     console.log("file written");

//   });
// });

// console.log("first print");

// .......... Server ..............//

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8",
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8",
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8",
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, `utf-8`);
const dataObj = JSON.parse(data);

const server = http.Server((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  // overview page
  if (pathname == "/" || pathname == "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    // produce page
  } else if (pathname == "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname == "/api") {
    res.writeHead(200, {
      "content-type": "application/json",
    });
    res.end(data);

    // Not found
  } else {
    res.end("the Page is not found!");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
