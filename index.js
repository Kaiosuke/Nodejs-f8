import express, { json } from "express";
import connect from "./config/db/index.js";
import routes from "./routes/index.js";

const port = 8888;

connect();

const app = express();

app.use(json());

routes(app);

app.use((req, res) => {
  return res.status(404).json({
    message: "Route not found",
  });
});

app.get("/", (req, res) => {
  console.log(req.body);
});

app.listen(port, () => {
  console.log(`Server is running ...: ${port}`);
});
