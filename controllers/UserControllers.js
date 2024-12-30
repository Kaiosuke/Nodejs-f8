import Users from "../models/Users.js";

const UserController = {
  //Get user
  getUsers: async (req, res) => {
    try {
      const users = await Users.find();
      if (!users) {
        return res.status(404).json({ message: "No users found" });
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

      const existingUser = await Users.findOne({ email: email });
      if (existingUser) {
        console.log(existingUser);
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

  //Update user
  updateUser: async (req, res) => {
    try {
      await Users.updateOne(req.param.id, { $set: req.body });
      return res.status(200).json({
        message: "Update success",
        user: req.body,
      });
    } catch (error) {
      console.log(error);
    }
  },

  //Delete user
  // deleteUser: async (req, res) => {
  //   try {
  //     await Users.deleteOne(req.param.id);
  //     return res.status(201).json({
  //       message: "Delete success",
  //       id: req.param.id,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
};

export default UserController;
