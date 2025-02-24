const { Invoice, User, Role, Client } = require("../models/mysql");

exports.createInvoice = (invoice) => {
  return Invoice.create(invoice);
};

exports.findById = (id) => {
    return Invoice.findOne({
      where: {
        id,
      },
    });
  };

  exports.updateInvoice = (invoice,id) => {
    return Invoice.update(
        {
            ...invoice,
        },
        {
            where: {
                id,
            },
        }
    );
  };

  exports.findAndCountAll = (whereClause,limit,offset) => {
    return Invoice.findAndCountAll(
        {
          where: whereClause,
          order: [["created_at", "DESC"]],
          limit: parseInt(limit),
          offset: parseInt(offset),
        include: [
          {
              model: User,
              as: "creator", // Alias for `created_by`
              attributes: ["user_id", "username", "email"],
              required: false,
              // include: [
              //     {
              //         model: Role,
              //         as: "role",
              //         attributes: ["role_id", "role_name"]
              //     }
              // ]
          },
          {
              model: User,
              as: "approver", // Alias for `approved_by`
              attributes: ["user_id", "username", "email"],
              required: false
          },
          {
              model: Client,
              as: "client", // Alias for `approved_by`
              attributes: ["id", "name"],
              required: false
          }
      ]
      })
  };