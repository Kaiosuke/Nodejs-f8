import {
  handleError400,
  handleError404,
  handleError409,
  handleError500,
  handleSuccess200,
  handleSuccess201,
} from "../helper/handleStatus.js";
import Users from "../models/data/User.js";

const UserController = {
  //Get users
  getUsers: async (req, res) => {
    try {
      const users = await Users.find();
      if (!users.length) {
        return handleError404(res, "Not found users");
      }

      return handleSuccess200(res, "Get users success", users);
    } catch (error) {
      return handleError500(res, error);
    }
  },

  //Get user
  getUser: async (req, res) => {
    try {
      const { id } = req.params;
      const users = await Users.findById(id);

      if (!users) {
        return handleError404(res, "Not found user");
      }

      return handleSuccess200(res, "Get user success", users);
    } catch (error) {
      return handleError500(res, error);
    }
  },

  //Post user
  createUser: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const existingEmail = await Users.findOne({ email: email });
      if (existingEmail) {
        return handleError409(res, "Email already exists");
      }
      const newUser = new Users({
        username,
        email,
        password,
      });

      await newUser.save();

      return handleSuccess200(res, "Create user success", newUser);
    } catch (error) {
      return handleError500(res, error);
    }
  },

  //Post users
  createUsers: async (req, res) => {
    try {
      const { users } = req.body;

      const isValid = users.filter(
        (user) => !user.username || !user.email || !user.password
      );

      if (isValid.length) {
        return handleError400(
          res,
          "Each user must have a username, email, and password",
          isValid
        );
      }

      const emails = users.map((user) => user.email);

      const duplicateEmails = emails.filter(
        (email, index) => emails.indexOf(email) !== index
      );

      if (duplicateEmails.length > 0) {
        return handleError400(
          res,
          "duplicate email from input data",
          duplicateEmails
        );
      }

      const existingEmail = await Users.find({ email: { $in: emails } });

      if (existingEmail.length > 0) {
        return handleError409(res, "Email already exists", existingEmail);
      }

      const newUsers = await Users.insertMany(users);

      return handleSuccess201(res, "Create user success", newUsers);
    } catch (error) {
      return handleError500(res, error);
    }
  },

  //Update user
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const findUser = await Users.findById(id);

      if (!findUser) {
        return handleError404(res, "Not found user");
      }

      const existingUser = await Users.findOne({ email: req.body.email });
      if (existingUser) {
        return handleError409(res, "Email already exists");
      }

      const user = await Users.findByIdAndUpdate(
        id,
        {
          $set: req.body,
        },
        { new: true }
      );
      return handleSuccess200(res, "Update user success", user);
    } catch (error) {
      return handleError500(res, error);
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await Users.findByIdAndDelete(id);
      if (!user) {
        return handleError404(res, "Not found user");
      }
      return handleSuccess200(res, "Delete user success", id);
    } catch (error) {
      return handleError500(res, error);
    }
  },

  // Delete users
  deleteUsers: async (req, res) => {
    try {
      const { ids } = req.body;

      const usersDelete = await Users.find({ _id: { $in: ids } });

      const user = await Users.deleteMany({ _id: { $in: ids } });

      if (!user.deletedCount) {
        return handleError404(res, "Not found user");
      }

      return handleSuccess200(
        res,
        `Delete ${usersDelete.length} ${
          usersDelete.length > 1 ? "users" : "user"
        } success`,
        usersDelete.map((user) => user._id)
      );
    } catch (error) {
      return handleError500(res, error);
    }
  },
};

export default UserController;
