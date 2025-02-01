const { ProductImage } = require("../models/mysql");

exports.createProductImage = (product) => {
  return ProductImage.bulkCreate(product);
};

exports.findProductImage = (product_id) => {
  return ProductImage.findAll({
    where: {
      product_id: product_id,
    },
  });
};

exports.deleteProductImage = async (product_id) => {
  return ProductImage.destroy({
    where: {
      product_id: product_id,
    },
  });
};

// Add a product image
exports.addProductImage = async (productId, imagePath) => {
  return await ProductImage.create({
    product_id: productId,
    image_path: imagePath
  });
};

// Find a product image by image_id
exports.findProductImageById = async (imageId) => {
  return await ProductImage.findOne({
    where: {
      id: imageId
    }
  });
};

// Remove a product image
exports.removeProductImage = async (imageId) => {
  return await ProductImage.destroy({
    where: {
      id: imageId
    }
  });
};

// Update a product image
exports.updateProductImage = async (imageId, updateData) => {
  return await ProductImage.update(updateData, {
    where: {
      id: imageId
    }
  });
};
