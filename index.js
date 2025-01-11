import express, { json } from "express";
import connect from "./config/db/index.js";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";

const { PORT } = process.env;

connect();

const app = express();

app.use(json());

app.use(cookieParser());

routes(app);

app.get("/", (req, res) => {
  return res.end("Hello");
});

app.use((req, res) => {
  return res.status(404).json({
    message: "Router not found",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running ...: ${PORT}`);
});
