// const UserModel = require('../models/user.model');
const { User, Role, RolePermission, Permission } = require('../models/mysql');
const cacheUtil = require('../utils/cache.util');

exports.createUser = (user) => {
    return User.create(user);
}

exports.updateUser = (user) => {
    return User.update(
        {
            token: user.token,
        },
        {
            where: {
                user_id: user.user_id,
                is_active: true
            },
        }
    );
};

exports.findUserByEmail = (email) => {
    return User.findOne({
        where: {
            email: email,
            is_active: true
        }
    })
}

exports.getUserDetailsById = async (userId) => {
    try {
      const userDetails = await User.findOne({
        where: { user_id: userId, is_active: true },
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
  
      if (!userDetails) {
        return { message: 'User not found' };
      }
  
      return userDetails.get({ plain: true });
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  };
  
  exports.getUserDetails = async () => {
    try {
      const userDetails = await User.findAll({
        attributes: ['user_id', 'username', 'email', 'is_active', 'created_at'],
        where: {
            is_active: true,
          },
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

  exports.findUserById = (user_id) => {
    return User.findOne({
      where: {
        user_id: user_id,
        is_active: true,
      },
    });
  };

exports.logoutUser = (token, exp) => {
    const now = new Date();
    const expire = new Date(exp * 1000);
    const milliseconds = expire.getTime() - now.getTime();
    /* ----------------------------- BlackList Token ---------------------------- */
    return cacheUtil.set(token, token, milliseconds);
}