const UserService = require("../services/user.service");
const AuthService = require("../services/auth.service");
const bcryptUtil = require("../utils/bcrypt.util");

exports.listUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.params; // Default values: page 1, 10 users per page
    const offset = (page - 1) * limit;

    const users = await UserService.getUserDetailsWithPagination(limit, offset);

    if (!users) {
      return res.status(400).json({
        message: "No users found.",
      });
    }

    const totalUsers = await UserService.getTotalUserCount();

    return res.json({
      data: users,
      pagination: {
        total: totalUsers,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalUsers / limit),
      },
      message: "Success.",
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
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

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await AuthService.findUserById(id);
  if (!user) {
    return res.status(400).json({
      message: "User does not exists.",
    });
  }

  return res.json({
    data: user,
    message: "User fetched successfully.",
  });
};
