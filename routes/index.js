import usersRouter from "./users.js";
import productsRouter from "./products.js";

const routes = (app) => {
  app.use("/api/users", usersRouter);
  app.use("/api/products", productsRouter);
};

export default routes;
