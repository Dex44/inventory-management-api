const { Product, ProductImage } = require("../models/mysql");

exports.createProduct = (product) => {
  return Product.create(product);
};

exports.findProduct = (product_id) => {
  return Product.findOne({
    where: {
      product_id: product_id,
    },
  });
};

exports.findProductById = (product_id) => {
  return Product.findOne({
    where: {
      product_id: product_id,
    },
    raw: true
  });
};
exports.findProductByName = (product_name) => {
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

exports.getProductsWithPagination = async (whereClause, limit, offset) => {  
  return Product.findAndCountAll({
    where: whereClause,
    attributes: [
      "product_id",
      "product_name",
      "description",
      "image_path",
      "price",
      "quantity",
      "created_at",
    ], // Select required attributes
    limit: parseInt(limit, 10), // Ensure `limit` is parsed as an integer
    offset: parseInt(offset, 10), // Ensure `offset` is parsed as an integer
    raw: true
  });
};
exports.getProducts = async () => {  
  return Product.findAndCountAll({
    attributes: [
      "product_id",
      "product_name",
      "description",
      "image_path",
      "price",
      "quantity",
      "created_at",
    ], // Select required attributes
    raw: true,
  });
};

// In ProductService
exports.getProductImages = async (product_id) => {
  return await ProductImage.findAll({
    where: { product_id: product_id },
    attributes: ['image_path','id'],
  });
}

exports.findAll = async (whereClause) => {  
  return await Product.findAll({
    where: whereClause,
    attributes: ['product_id','product_name','description','image_path','quantity','price'],
    raw: true
  });
}
