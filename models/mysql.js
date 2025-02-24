const sequelize = require("./connection");
const { Sequelize, DataTypes } = require("sequelize");

  const DbBootstrap = async () => {
    sequelize
      .sync()
      .then(() => {
        console.log("MYSQL BOOTSTRAP :: SUCCESS");
      })
      .catch((error) => {
        console.log(`Error connecting to database :: ${error}`);
      });
  }

// Roles Model
const Role = sequelize.define(
  "Role",
  {
    role_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

// Users Model
const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: "role_id",
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users", // Circular reference
        key: "user_id",
      },
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Permissions Model
const Permission = sequelize.define(
  "Permission",
  {
    permission_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    permission_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: false,
  }
);

// RolePermissions Model
const RolePermission = sequelize.define(
  "RolePermission",
  {
    role_permission_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: "role_id",
      },
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Permission,
        key: "permission_id",
      },
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

// Products Model
const Product = sequelize.define(
  "Product",
  {
    product_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image_path: {
      type: DataTypes.STRING,
      allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "user_id",
      },
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// AuditLogs Model
const AuditLog = sequelize.define(
  "AuditLog",
  {
    log_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    timestamps: false,
  }
);

// Product image model
const ProductImage = sequelize.define('ProductImage', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'product_id'
    },
    onDelete: 'CASCADE'
  },
  image_path: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});

const Client = sequelize.define('Client', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobile: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  timestamps: false
});

const Invoice = sequelize.define('Invoice', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
  },
  created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: User,
          key: 'user_id'
      },
      onDelete: 'CASCADE'
  },
  approved_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
          model: User,
          key: 'user_id'
      },
      onDelete: 'SET NULL'
  },
  amount: {
      type: DataTypes.DECIMAL(10, 2), // Storing array of client IDs
      allowNull: false
  },
  client_id: {
      type: DataTypes.INTEGER, // Storing array of client IDs
      allowNull: false
  },
  is_approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
  },
  created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
  },
  updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Associations
Role.hasMany(User, { foreignKey: "role_id" });
User.belongsTo(Role, { foreignKey: "role_id" });

User.hasMany(Product, { foreignKey: "created_by" });
Product.belongsTo(User, { as: "Creator", foreignKey: "created_by" });
Product.belongsTo(User, { as: "Updater", foreignKey: "updated_by" });

Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "role_id",
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permission_id",
});

User.hasMany(AuditLog, { foreignKey: "user_id" });
AuditLog.belongsTo(User, { foreignKey: "user_id" });

Role.hasMany(RolePermission, { foreignKey: 'role_id' });
RolePermission.belongsTo(Role, { foreignKey: 'role_id' });

Permission.hasMany(RolePermission, { foreignKey: 'permission_id' });
RolePermission.belongsTo(Permission, { foreignKey: 'permission_id' });

Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

User.hasMany(User, { foreignKey: 'created_by', as: 'CreatedBy' });

Invoice.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Invoice.belongsTo(User, { foreignKey: 'approved_by', as: 'approver' });
Invoice.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });


module.exports = { Role, User, Permission, RolePermission, Product, AuditLog, ProductImage, Client, Invoice, DbBootstrap };


(async () => {
    try {
        // Check if Roles table is empty
        const roleCount = await Role.count();
        if (roleCount === 0) {
            console.log('Inserting roles...');
            const adminRole = await Role.create({ role_name: 'Admin' });
            const staffRole = await Role.create({ role_name: 'Staff' });

            // Check if Permissions table is empty
            const permissionCount = await Permission.count();
            if (permissionCount === 0) {
                console.log('Inserting permissions...');
                const permissions = await Permission.bulkCreate([
                    { permission_name: 'create_user' },
                    { permission_name: 'update_user' },
                    { permission_name: 'delete_user' },
                    { permission_name: 'view_users' },
                    { permission_name: 'add_product' },
                    { permission_name: 'modify_product' },
                    { permission_name: 'delete_product' },
                ]);

                // Check if RolePermissions table is empty
                const rolePermissionCount = await RolePermission.count();
                if (rolePermissionCount === 0) {
                    console.log('Assigning permissions to roles...');
                    await RolePermission.bulkCreate([
                        ...permissions.map((perm) => ({
                            role_id: adminRole.role_id,
                            permission_id: perm.permission_id,
                        })),
                        ...permissions
                            .filter((perm) =>
                                ['add_product', 'modify_product', 'delete_product'].includes(perm.permission_name)
                            )
                            .map((perm) => ({
                                role_id: staffRole.role_id,
                                permission_id: perm.permission_id,
                            })),
                    ]);
                }
            }
        }

        // Check if Users table is empty
        const userCount = await User.count();
        if (userCount === 0) {
            console.log('Inserting users...');
            const adminUser = await User.create({
                username: 'admin1',
                email: 'admin1@example.com',
                password_hash: 'hashedpassword1',
                role_id: 1, // Assuming Admin's role_id is 1
                is_active: true,
                created_by: null,
            });

            await User.create({
                username: 'staff1',
                email: 'staff1@example.com',
                password_hash: 'hashedpassword2',
                role_id: 2, // Assuming Staff's role_id is 2
                is_active: true,
                created_by: adminUser.user_id,
            });
        }

        // Check if Products table is empty
        const productCount = await Product.count();
        if (productCount === 0) {
            console.log('Inserting products...');
            await Product.bulkCreate([
                {
                    product_name: 'Laptop',
                    description: 'High-performance laptop',
                    quantity: 10,
                    price: 999.99,
                    created_by: 1, // Assuming admin1's user_id is 1
                },
                {
                    product_name: 'Smartphone',
                    description: 'Latest model smartphone',
                    quantity: 20,
                    price: 699.99,
                    created_by: 2, // Assuming staff1's user_id is 2
                },
            ]);
        }

        // Check if AuditLogs table is empty
        const auditLogCount = await AuditLog.count();
        if (auditLogCount === 0) {
            console.log('Inserting audit logs...');
            await AuditLog.bulkCreate([
                {
                    user_id: 1, // Assuming admin1's user_id is 1
                    action: 'Created user staff1',
                    details: 'User staff1 was created with the Staff role.',
                },
                {
                    user_id: 2, // Assuming staff1's user_id is 2
                    action: 'Added product Smartphone',
                    details: 'A new product Smartphone was added to inventory.',
                },
            ]);
        }
    } catch (error) {
        console.error('Error inserting dummy data:', error);
    }
})();
