const { Client } = require("../models/mysql");

exports.createClient = (client) => {
  return Client.create(client);
};

exports.findClient = (name) => {
  return Client.findOne({
    where: {
      name: name,
    },
  });
};

exports.findClientById = (id) => {
  return Client.findOne({
    where: {
      id: id,
    },
  });
};

exports.updateClient = (client,id) => {
  return Client.update(
      {
          ...client,
      },
      {
          where: {
              id,
          },
      }
  );
};

exports.deleteClient = async (id) => {
  return Client.destroy({
    where: {
      id,
    },
  });
};

exports.getClientDetailsWithPagination = async (limit, offset) => {
  return Client.findAll({
    limit: parseInt(limit),
    offset: parseInt(offset),
  });
};

exports.getTotalClientCount = async () => {
  return Client.count();
};