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

  exports.getProductById = async (req, res) => {
    try {
      const { id } = req.params; // Get product_id from route parameters
  
      // Find product by ID
      const product = await ProductService.findProductById(id);
  
      if (!product) {
        return res.status(404).json({
          message: "Product does not exist.",
        });
      }
  
      return res.json({
        data: product,
        message: "Product retrieved successfully.",
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      return res.status(500).json({
        message: "Internal Server Error.",
      });
    }
  };
  
  exports.listProducts = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.params; // Default page = 1, limit = 10
  
      // Calculate offset and limit
      const offset = (page - 1) * limit;
  
      // Fetch products with pagination
      const { rows: products, count: total } = await ProductService.getProductsWithPagination(limit, offset);
  
      if (products.length === 0) {
        return res.status(404).json({
          message: "No products found.",
        });
      }
  
      return res.json({
        data: {
          products,
          pagination: {
            total,
            page: page,
            limit: limit,
            totalPages: Math.ceil(total / limit),
          },
        },
        message: "Products retrieved successfully.",
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({
        message: "Internal Server Error.",
      });
    }
  };
  
