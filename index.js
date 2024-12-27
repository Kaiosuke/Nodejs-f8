import { createServer } from "node:http";

const hostname = "127.0.0.1";
const port = 3000;

const users = [
  {
    id: 1,
    username: "Tran",
  },
  {
    id: 2,
    username: "Hung",
  },
  {
    id: 3,
    username: "Dao",
  },
];

const server = createServer((req, res) => {
  res.statusCode = 200;
  const url = req.url;
  const method = req.method;
  res.setHeader("Content-Type", "application/json");
  if (url === "/users") {
    switch (method) {
      case "GET":
        return res.end(
          JSON.stringify({
            message: "Danh sách users",
            users,
          })
        );
      case "POST":
        let body = "";
        req.on("data", (chunk) => {
          console.log(chunk);
          body += chunk.toString();
        });

        return req.on("end", () => {
          const { username } = JSON.parse(body);
          const newUser = {
            id: users.length + 1,
            username,
          };
          users.push(newUser);
          res.writeHead(201);
          res.end(JSON.stringify(newUser));
        });
      default:
        throw new Error("error method");
    }
  } else if (url.match(/\/users\/\d+/)) {
    const id = parseInt(url.split("/")[2]);
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    switch (method) {
      case "GET":
        const findUser = users.find((user) => user.id === id);
        if (findUser) {
          res.writeHead(200);
          res.end(JSON.stringify({ message: "Find User Success", findUser }));
        } else {
          res.writeHead(400);
          res.end(JSON.stringify({ message: "Find User Failed" }));
        }
      case "PUT":
        const userIndex = users.findIndex((u) => u.id === id);
        if (userIndex !== -1) {
          return req.on("end", () => {
            const { username } = JSON.parse(body);
            users[userIndex] = { id, username };
            res.writeHead(200);
            res.end(JSON.stringify(users[userIndex]));
          });
        }
      case "DELETE":
        return req.on("end", () => {
          const newUsers = users.filter((user) => user.id !== id);
          users.length = 0;
          users.push(...newUsers);
          res.writeHead(200);
          res.end(JSON.stringify({ message: "Delete Success", id }));
        });
      default:
        throw new Error("error");
    }
  } else {
    res.writeHead(404);
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
