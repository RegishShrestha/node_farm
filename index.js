const fs = require("fs");
const http = require("http");
const url = require("url");
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

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  //   console.log(req.url);

  const pathName = req.url;
  if (pathName === "/" || pathName === "/overview") {
    res.end("This is overview");
  } else if (pathName === "/product") {
    res.end("This is product");
  } else if (pathName === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404);
    res.end("404 page not found");
  }
  //   res.end("Hello from regish");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requist");
});
