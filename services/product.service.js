const { Product } = require("../models/mysql");

exports.createProduct = (product) => {
  return Product.create(product);
};

exports.findProduct = (product_name) => {
  return Product.findOne({
    where: {
      product_name: product_name,
    },
  });
};

exports.findProductById = (product_id) => {
  return Product.findOne({
    where: {
      product_id: product_id,
    },
  });
};

exports.updateProduct = (product, product_id) => {
  return Product.update(
    {
      ...product,
    },
    {
      where: {
        product_id: product_id,
      },
    }
  );
};

exports.deleteProduct = async (product_id) => {
  return Product.destroy({
    where: {
      product_id: product_id,
    },
  });
};

exports.getProductsWithPagination = async (limit, offset) => {
  return Product.findAndCountAll({
    attributes: [
      "product_id",
      "product_name",
      "price",
      "quantity",
      "created_at",
    ], // Select required attributes
    limit: parseInt(limit, 10), // Ensure `limit` is parsed as an integer
    offset: parseInt(offset, 10), // Ensure `offset` is parsed as an integer
  });
};
