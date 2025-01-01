const UserService = require("../services/user.service");
const AuthService = require("../services/auth.service");
const bcryptUtil = require("../utils/bcrypt.util");

exports.getUser = async (req, res) => {
  const user = await UserService.getUserDetails();
  return res.json({
    data: user,
    message: "Success.",
  });
};

exports.createUser = async (req, res) => {
  const isExist = await AuthService.findUserByEmail(req.body.email);
  if (isExist) {
    return res.status(400).json({
      message: "Email already exists.",
    });
  }
  const hashedPassword = await bcryptUtil.createHash(req.body.password);
  const userData = {
    username: req.body.name,
    email: req.body.email,
    role_id: req.body.role,
    password_hash: hashedPassword,
  };

  const user = await AuthService.createUser(userData);
  return res.json({
    data: user,
    message: "User created successfully.",
  });
};

exports.updateUser = async (req, res) => {
  const isExist = await AuthService.findUserById(req.body.user_id);
  if (!isExist) {
    return res.status(400).json({
      message: "User does not exists.",
    });
  }
  const userData = {
    username: req.body.name,
    email: req.body.email,
    role_id: req.body.role,
  };

  await UserService.updateUser(userData, req.body.user_id);
  return res.json({
    message: "User updated successfully.",
  });
};

exports.deleteUser = async (req, res) => {
  const isExist = await AuthService.findUserById(req.body.user_id);
  if (!isExist) {
    return res.status(400).json({
      message: "User does not exists.",
    });
  }

  await UserService.deactivateUser(req.body.user_id);
  return res.json({
    message: "User deleted successfully.",
  });
};
