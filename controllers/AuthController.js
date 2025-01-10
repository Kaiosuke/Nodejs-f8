import {
  handleError400,
  handleError404,
  handleError500,
  handleSuccess200,
  handleSuccess201,
} from "../helper/handleStatus.js";
import nodeMailer from "../helper/nodeMailer.js";
import Users from "../models/data/User.js";
import bcrypt from "bcryptjs";

const AuthController = {
  login: async (req, res) => {
    try {
      const user = await Users.findOne({
        email: req.body.email,
      });

      if (!user) {
        return handleError404(res, "Not Found user");
      }

      const passwordCompare = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!passwordCompare) {
        return handleError404(res, "Password is incorrect");
      }

      await nodeMailer(user);

      return handleSuccess200(res, "Login success", user);
    } catch (error) {
      return handleError500(res, error);
    }
  },

  register: async (req, res) => {
    try {
      const exitsEmail = await Users.findOne({ email: req.body.email });

      if (exitsEmail) {
        return handleError400(res, "Email is exits", exitsEmail);
      }

      const { password } = req.body;
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(password, salt);

      const newUser = await Users.create({
        ...req.body,
        password: secPass,
      });

      return handleSuccess201(res, "Create user success", newUser);
    } catch (error) {
      return handleError500(res, error);
    }
  },
};

export default AuthController;
