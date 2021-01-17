const http = require("http");
const fs = require("fs");
const path = require("path");

//create a server object:
const server = http.createServer(function (req, res) {
  let reqUrl = req.url;
  console.log("REQUESTED => ", reqUrl);
  let filePath = path.join(
    __dirname,
    "public",
    req.url === "/" ? "index.html" : req.url
  );

  let extname = path.extname(filePath);

  let contentType = "text/html";

  switch (extname) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
    default:
  }

  if (req.url.includes("/api")) {
    // API ROUTES
    switch (req.url) {
      case "/api/users":
        const users = [
          { name: "Rohit Mahto", age: 22 },
          { name: "Aman Kumar", age: 23 },
          { name: "Ankit Sinha", age: 22 }
        ];
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(users));
        break;
      default:
    }
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        // Page not found
        fs.readFile(
          path.join(__dirname, "public", "404.html"),
          (err, content) => {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end(content, "utf8");
          }
        );
      } else {
        //  Some server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf8");
    }
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT);
//the server object listens on port 8080
