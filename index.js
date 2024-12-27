import express, { json } from "express";

const app = express();
const port = 3000;

const users = [
  {
    id: 1,
    username: "Tran",
  },
  {
    id: 2,
    username: "Quoc",
  },
  {
    id: 3,
    username: "Tuan",
  },
];

app.use(json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  res.send(users);
});

app.post("/users", (req, res) => {
  users.push(req.body);
  res.send("Create success");
});

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
