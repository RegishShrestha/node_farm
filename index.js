const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');
/////////////////////////////////
// Files

// syncronous way
/*
const textIn = fs.readFileSync("./txt/append.txt", "utf-8");
console.log(textIn);

const textOut = `THis is written in avacode:${textIn}.\n Created on ${Date.now()}`;
fs.writeFileSync("./txt/output.txt", textOut);
console.log("File written");
*/
// asychronous way

/*
fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
  if (err) return console.log(err);
  console.log(data1);
  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
    console.log(data2);
    fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
      console.log(data3);
      fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
        console.log("YOur file has been written");
      });
    });
  });
});
console.log("Will read this file");
*/
//////////////////////////
// SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const slugs = dataObj.map((el) => {
  return slugify(el.productName, { lower: true });
});
console.log(slugs);

const server = http.createServer((req, res) => {
  // console.log(req.url);
  const { query, pathname } = url.parse(req.url, true);

  // const pathname = req.url;

  //   Overview Page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cardsHtml = dataObj
      .map((el) => {
        return replaceTemplate(tempCard, el);
      })
      .join('');
    // console.log(cardsHtml);
    const output = tempOverview.replace('{%PRODUCT_CARD%}', cardsHtml);
    res.end(output);
  }
  //   Product Page
  else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const output = replaceTemplate(tempProduct, dataObj[query.id]);

    res.end(output);
  }
  //   API
  else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
  }
  //   404 Not found
  else {
    res.writeHead(404);
    res.end('404 page not found');
  }

  //   res.end("Hello from regish");
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to request on port 8000');
});
