const { Invoice } = require("../models/mysql");

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
      })
  };