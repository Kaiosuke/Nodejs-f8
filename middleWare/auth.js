import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.headers.token;
  if (token) {
    const accessToken = token.split(" ")[1];
    if (accessToken) {
      jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN, (err, user) => {
        if (err) {
          return res.status(403).json("Token is not valid");
        } else {
          req.user = user;
          next();
        }
      });
    }
  } else {
    return res.status(401).json("You're not authenticated");
  }
};

const verifyAuth = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "admin" || req.user.role === "ceo") {
      next();
    } else {
      return res.status(403).json("You don't have permission");
    }
  });
};

export { verifyToken, verifyAuth };
