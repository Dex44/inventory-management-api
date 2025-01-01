const ProductService = require("../services/product.service");

exports.createProduct = async (req, res) => {
    
    const isExist = await ProductService.findProduct(req.body.product_name);
    if (isExist) {
      return res.status(400).json({
        message: "Same product already exists.",
      });
    }
    const productData = {
      product_name: req.body.product_name,
      description: req.body.description,
      quantity: req.body.quantity,
      price: req.body.price,
      created_by: req.user.id,
      updated_by: req.user.id,
    };
  
    const product = await ProductService.createProduct(productData);
    return res.json({
      data: product,
      message: "Product created successfully.",
    });
  };

exports.updateProduct = async (req, res) => {
    
    const isExist = await ProductService.findProduct(req.body.product_name);
    if (!isExist) {
      return res.status(400).json({
        message: "Product does not exists.",
      });
    }
    const productData = {
      product_name: req.body.product_name,
      description: req.body.description,
      quantity: req.body.quantity,
      price: req.body.price,
      updated_by: req.user.id,
    };
  
    await ProductService.updateProduct(productData,isExist.product_id);
    return res.json({
      message: "Product updated successfully.",
    });
  };

  exports.deleteProduct = async (req, res) => {
    const isExist = await ProductService.findProduct(req.body.product_name);
    if (!isExist) {
      return res.status(400).json({
        message: "Product does not exists.",
      });
    }
  
    await ProductService.deleteProduct(isExist.product_id);
    return res.json({
      message: "Product deleted successfully.",
    });
  };