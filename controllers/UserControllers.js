import Users from "../models/Users.js";

const UserController = {
  //Get users
  getUsers: async (req, res) => {
    try {
      const users = await Users.find();
      if (!users) {
        return res.status(404).json({ message: "Not found users" });
      }

      return res.status(200).json({
        message: "Get users success",
        users,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  //Get users
  getUser: async (req, res) => {
    try {
      const { id } = req.params;
      const users = await Users.findById(id);

      if (!users) {
        return res.status(404).json({ message: "Not found user" });
      }

      return res.status(200).json({
        message: "Get user success",
        users,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  //Post user
  createUser: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({
          message: "Name, email and password are required",
        });
      }

      const existingEmail = await Users.findOne({ email: email });
      if (existingEmail) {
        return res.status(409).json({
          message: "Email already exists",
        });
      }
      const newUser = new Users({
        username,
        email,
        password,
      });

      await newUser.save();

      return res.status(201).json({
        message: "Create user success",
        newUser,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
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
        return res.status(400).json({
          message: "Each user must have a username, email, and password",
          isValid,
        });
      }

      const emails = users.map((user) => user.email);

      const duplicateEmails = emails.filter(
        (email, index) => emails.indexOf(email) !== index
      );

      if (duplicateEmails.length > 0) {
        return res.status(400).json({
          message: "duplicate email from input data",
          duplicateEmails,
        });
      }

      const existingEmail = await Users.find({ email: { $in: emails } });

      if (existingEmail.length > 0) {
        return res.status(409).json({
          message: "Email already exists",
          existingEmail,
        });
      }

      const newUsers = await Users.insertMany(users);

      return res.status(201).json({
        message: "Create user success",
        newUsers,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  //Update user
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const findUser = await Users.findById(id);

      if (!findUser) {
        return res.status(404).json({
          message: "Not found user",
        });
      }

      const existingUser = await Users.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(409).json({
          message: "Email already exists",
        });
      }

      const user = await Users.findByIdAndUpdate(
        id,
        {
          $set: req.body,
        },
        { new: true }
      );

      return res.status(200).json({
        message: "Update user success",
        user,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await Users.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({
          message: "Not found user",
        });
      }

      return res.status(200).json({
        message: "Delete user success",
        id,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  // Delete users
  deleteUsers: async (req, res) => {
    try {
      const { ids } = req.body;

      const usersDelete = await Users.find({ _id: { $in: ids } });

      const user = await Users.deleteMany({ _id: { $in: ids } });

      if (user.deletedCount < 1) {
        return res.status(404).json({
          message: "Not found user",
        });
      }

      return res.status(200).json({
        message: `Delete ${usersDelete.length} ${
          usersDelete.length > 1 ? "users" : "user"
        } success`,
        ids: usersDelete.map((user) => user._id),
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },
};

export default UserController;
