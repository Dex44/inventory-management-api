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
