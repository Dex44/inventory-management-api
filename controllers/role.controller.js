const RoleService = require("../services/role.service");

exports.listRoles = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.body;

    const offset = (page - 1) * limit;
    const roles = await RoleService.getRolesWithPagination(limit, offset);

    if (!roles.length) {
      return res.status(404).json({ message: "No roles found." });
    }

    const totalRoles = await RoleService.getTotalRoleCount();

    return res.json({
      data: roles,
      pagination: {
        count: totalRoles,
        page: page,
        limit: limit,
      },
      message: "Roles retrieved successfully.",
    });
  } catch (error) {
    console.error("Error listing roles:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};
