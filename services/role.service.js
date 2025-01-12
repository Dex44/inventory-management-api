const { Role, RolePermission, Permission } = require("../models/mysql");

exports.getRolesWithPagination = async (limit, offset) => {
    try {
      return await Role.findAll({
        attributes: ["role_id", "role_name", "created_at"],
        limit: parseInt(limit, 10), // Ensure `limit` is parsed as an integer
        offset: parseInt(offset, 10), // Ensure `offset` is parsed as an integer
        include: [
          {
            model: RolePermission,
            attributes: ["role_permission_id"],
            include: [
              {
                model: Permission,
                attributes: ["permission_name"], // Include permission details
              },
            ],
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching roles with pagination:", error);
      throw error;
    }
  };

  exports.getTotalRoleCount = async () => {
    try {
      return await Role.count();
    } catch (error) {
      console.error("Error fetching total role count:", error);
      throw error;
    }
  };
  