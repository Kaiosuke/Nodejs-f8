import usersRouter from "./users.js";

const routes = (app) => {
  app.use("/api/users", usersRouter);
};

export default routes;
