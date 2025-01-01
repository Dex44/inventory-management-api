const { User, Role, RolePermission, Permission } = require('../models/mysql');

exports.getUserDetails = async () => {
    try {
      const userDetails = await User.findAll({
        where: {
            is_active: true,
          },
        attributes: ['user_id', 'username', 'email', 'is_active', 'created_at'],
        include: [
          {
            model: Role,
            attributes: ['role_name'],
            include: [
              {
                model: RolePermission,
                attributes: ['role_permission_id'],
                include: [
                  {
                    model: Permission,
                    attributes: ['permission_name'],
                  },
                ],
              },
            ],
          },
          {
            model: User,
            as: 'CreatedBy',
            attributes: ['username'],
          },
        ],
      });
  
      if (!userDetails || userDetails.length === 0) {
        return { message: 'No users found' };
      }
  
      return userDetails;
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  };

  exports.updateUser = (user,id) => {
    return User.update(
        {
            ...user,
        },
        {
            where: {
                user_id: id,
                is_active: true
            },
        }
    );
};

exports.deactivateUser = (id) => {
    return User.update(
      {
        is_active: false,
      },
      {
        where: {
          user_id: id,
        },
      }
    );
  };
  
  