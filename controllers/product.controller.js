const fs = require("fs");
const path = require("path");

const ProductService = require("../services/product.service");
const ProductImageService = require("../services/productImage.service");
const { Op } = require("sequelize");

exports.createProduct = async (req, res) => {
  const isExist = await ProductService.findProductByName(req.body.product_name);
  if (isExist) {
    return res.status(400).json({
      message: "Same product already exists.",
    });
  }

  const uploadDir = "uploads/";
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const newImageName = `${Date.now()}${path.extname(req.file.originalname)}`;
  const newImagePath = path.join("uploads", newImageName);

  fs.renameSync(req.file.path, newImagePath);

  try {
    const productData = {
      product_name: req.body.product_name,
      description: req.body.description,
      image_path: newImagePath,
      quantity: req.body.quantity,
      price: req.body.price,
      created_by: req.user.id,
      updated_by: req.user.id,
    };

    const product = await ProductService.createProduct(productData);

    return res.json({
      data: product,
      message: "Product created successfully with images.",
    });
  } catch (error) {
    console.error(error);
    fs.unlinkSync(req.file.path);
    return res.status(500).json({
      message: "Error creating product and uploading images.",
    });
  }
};

exports.updateProduct = async (req, res) => {
  const isExist = await ProductService.findProduct(req.body.product_id);
  if (!isExist) {
    return res.status(400).json({
      message: "Product does not exists.",
    });
  }

if(req.file && req.body.action === 'update'){
    if(isExist.image_path){
      fs.unlinkSync(isExist.image_path);
    }
    const newImageName = `${Date.now()}${path.extname(req.file.originalname)}`;
    const newImagePath = path.join("uploads", newImageName);
    
    fs.renameSync(req.file.path, newImagePath);
    
    const productData = {
      product_name: req.body.product_name,
      description: req.body.description,
      quantity: req.body.quantity,
      image_path: newImagePath,
      price: req.body.price,
      updated_by: req.user.id,
    };
    
    await ProductService.updateProduct(productData, isExist.product_id);
    
  }else if(req.body.action === 'delete'){
      if(isExist.image_path){
        fs.unlinkSync(isExist.image_path);
      }
    const productData = {
      product_name: req.body.product_name,
      description: req.body.description,
      image_path: null,
      quantity: req.body.quantity,
      price: req.body.price,
      updated_by: req.user.id,
    };
  
    await ProductService.updateProduct(productData, isExist.product_id);
    
  }else{
    const productData = {
      product_name: req.body.product_name,
      description: req.body.description,
      quantity: req.body.quantity,
      price: req.body.price,
      updated_by: req.user.id,
    };
  
    await ProductService.updateProduct(productData, isExist.product_id);

  }

  return res.json({
    message: "Product updated successfully.",
  });
};

exports.deleteProduct = async (req, res) => {
  try {
    const { product_id } = req.body;

    const product = await ProductService.findProduct(product_id);
    if (!product) {
      return res.status(400).json({
        message: "Product does not exist.",
      });
    }

    const productImages = await ProductImageService.findProductImage(
      product_id
    );
    console.log("productImages", productImages);

    productImages.forEach((image) => {
      console.log("image", image);
      const imagePath = path.join(__dirname, "..", image.image_path);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    await ProductImageService.deleteProductImage(product_id);

    await ProductService.deleteProduct(product_id);

    return res.json({
      message: "Product and associated images deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while deleting the product.",
    });
  }
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
    
    product.image = `http://${req.headers.host}/uploads/${path.basename(
      product.image_path
    )}`
    
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
    const { page = 1, limit = 10, product_name } = req.body; // Default page = 1, limit = 10
    console.log("product_name", req.body);
    
    // Calculate offset and limit
    const offset = (page - 1) * limit;

    const whereClause = {};
        if (product_name) whereClause.product_name = { [Op.like]: `%${product_name}%` };;

    // Fetch products with pagination
    const { rows: products, count: total } =
      page !== 0 ? await ProductService.getProductsWithPagination(whereClause, limit, offset) : await ProductService.getProducts();

    if (products.length === 0) {
      return res.status(404).json({
        message: "No products found.",
      });
    }

    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const imagesWithUrls = `http://${req.headers.host}/uploads/${path.basename(
            product.image_path
          )}`
        return {
          ...product,
          image: imagesWithUrls,
        };
      })
    );

    return res.json({
      data: {
        products: productsWithImages,
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

exports.manageProductImage = async (req, res) => {
  const { action, image_id } = req.body;
  const productId = req.params.product_id;

  try {
    // Validate product existence
    const product = await ProductService.findProduct(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    switch (action) {
      case "add":
        // Add a new image
        if (!req.file) {
          return res.status(400).json({ message: "No image file uploaded." });
        }

        // Prepare image data
        const newImageName = `${productId}_${Date.now()}${path.extname(
          req.file.originalname
        )}`;
        const newImagePath = path.join("uploads", newImageName);

        // Rename the file to a new name and move it to the correct folder
        fs.renameSync(req.file.path, newImagePath);

        // Save image record to database
        const newImage = await ProductImageService.addProductImage(
          productId,
          `/uploads/${newImageName}`
        );

        return res.json({
          message: "Image added successfully.",
          data: newImage,
        });

      case "remove":
        // Remove an existing image
        const imageToDelete = await ProductImageService.findProductImageById(
          image_id
        );
        if (!imageToDelete) {
          return res.status(404).json({ message: "Image not found." });
        }

        // Delete the image file from server
        const imagePath = path.join(__dirname, "..", imageToDelete.image_path);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }

        // Remove image record from database
        await ProductImageService.removeProductImage(image_id);

        return res.json({
          message: "Image removed successfully.",
        });

      case "update":
        // Update an existing image
        const imageToUpdate = await ProductImageService.findProductImageById(
          image_id
        );
        if (!imageToUpdate) {
          return res.status(404).json({ message: "Image not found." });
        }

        if (!req.file) {
          return res.status(400).json({ message: "No image file uploaded." });
        }

        // Delete the old image file from server
        const oldImagePath = path.join(
          __dirname,
          "..",
          imageToUpdate.image_path
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }

        // Prepare and save the new image
        const newFileName = `${productId}_${Date.now()}${path.extname(
          req.file.originalname
        )}`;
        const newFilePath = path.join("uploads", newFileName);
        fs.renameSync(req.file.path, newFilePath);

        // Update the image record in the database
        const updatedImage = await ProductImageService.updateProductImage(
          image_id,
          { image_path: `/uploads/${newFileName}` }
        );

        return res.json({
          message: "Image updated successfully.",
          data: updatedImage,
        });

      default:
        return res
          .status(400)
          .json({
            message: "Invalid action. Please use 'add', 'remove', or 'update'.",
          });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
