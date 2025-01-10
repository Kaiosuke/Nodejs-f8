const dataMiddleWare = (schema) => async (req, res, next) => {
  try {
    const data = schema.parse(req.body);
    data && console.log(data);
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Internal server error",
      error: error.issues.map((err) => {
        return `${err.path}: ${err.message}`;
      }),
    });
  }
};

const dataListMiddleWare = (schema, key) => async (req, res, next) => {
  try {
    const dataList = req.body[key];
    dataList.forEach((element) => {
      schema.parse(element);
    });

    next();
  } catch (error) {
    return res.status(400).json({
      message: "Internal server error",
      error: error.issues.map((err) => {
        return `${err.path}: ${err.message}`;
      }),
    });
  }
};

export { dataMiddleWare, dataListMiddleWare };
