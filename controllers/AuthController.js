import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {
  handleError404,
  handleError500,
  handleSuccess200,
  handleSuccess201,
} from "../helper/handleStatus.js";
import nodeMailer from "../helper/nodeMailer.js";
import Users from "../models/data/User.js";

dotenv.config();

let refreshTokens = [];

const AuthController = {
  // Register
  register: async (req, res) => {
    try {
      const passwordUser = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(passwordUser, salt);

      const newUser = await Users.create({
        ...req.body,
        password: secPass,
      });

      const { password, ...others } = newUser._doc;

      await nodeMailer(others);

      return handleSuccess201(res, "Create user success", others);
    } catch (error) {
      return handleError500(res, error);
    }
  },

  // Login
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        user: user._id,
        role: user.role,
      },
      process.env.JWT_ACCESS_TOKEN,
      { expiresIn: "10d" }
    );
  },

  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        user: user._id,
        role: user.role,
      },
      process.env.JWT_REFRESH_TOKEN,
      { expiresIn: "365d" }
    );
  },

  login: async (req, res) => {
    try {
      const user = await Users.findOne({
        email: req.body.email,
      });

      if (!user) {
        return handleError404(res, "Not Found user");
      }

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!validPassword) {
        return handleError404(res, "Password is incorrect");
      }

      const accessToken = AuthController.generateAccessToken(user);
      const refreshToken = AuthController.generateRefreshToken(user);

      refreshTokens.push(refreshToken);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });

      const { password, ...others } = user._doc;

      return handleSuccess200(res, "Login success", {
        others,
        accessToken,
      });
    } catch (error) {
      return handleError500(res, error);
    }
  },

  requestRefreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json("You're not authenticated");
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not valid");
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, user) => {
      if (err) {
        return res.status(403).json(err);
      }
      const newAccessToken = AuthController.generateAccessToken(user);
      const newRefreshToken = AuthController.generateRefreshToken(user);

      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      refreshTokens.push(newRefreshToken);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });

      return res.status(200).json({ accessToken: newAccessToken });
    });
  },

  // Logout
  logout: async (req, res) => {
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    return res.status(200).json("Logout success");
  },
};

export default AuthController;
