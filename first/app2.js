const fs = require("fs");
const http = require("http");

//this could be empty
const users = ["PARTHA"];

const server = http.createServer((req, res) => {
  const url = req.url;
  if (url === "/") {
    const usersHtml = users.map((user) => {
      return `<li>${user}</li>`;
    });
    res.write(
      `<html><head><title>Users</title></head><body><h1>Hello user</h1>
        <form action='/create-user' method='POST'><input type='text' name='user'/><button type='submit'>Submit</button></form><ul>${usersHtml.join(
        ""
      )}</ul></body></html>`
    );
    return res.end();
  }

  if (url === "/create-user" && req.method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const user = parsedBody.split("=")[1];
      users.push(user);
      res.statusCode = 302;
      res.setHeader("Location", "/");
      return res.end();
    });
  }

  res.setHeader("Content-Type", "text/html");
  res.write("<h1> not exited </h1>");
  res.end();
});

server.listen(3000);