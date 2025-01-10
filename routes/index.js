import authRouter from "./auth.js";
import usersRouter from "./user.js";
import productsRouter from "./product.js";
import categoryRouter from "./category.js";

const routes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/products", productsRouter);
  app.use("/api/categories", categoryRouter);
};

export default routes;
