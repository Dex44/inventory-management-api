const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const AuthController = require('../controllers/auth.controller');
const UserController = require('../controllers/user.controller');
const ProductController = require('../controllers/product.controller');
const RoleController = require('../controllers/role.controller');
const ErrorHandler = require('../middleware/error.middleware');
const AuthGuard = require('../middleware/auth.middleware');
const schema = require('../validatons/auth.validation');
const validate = require('../utils/validator.util'); 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Temporary storage directory
    },
    filename: function (req, file, cb) {
        cb(null,file.originalname); // Assign a temporary name
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only images are allowed'));
    }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit per file
    fileFilter: fileFilter
});

router.post('/register', validate(schema.register), ErrorHandler(AuthController.register));
router.post('/login', validate(schema.login), ErrorHandler(AuthController.login));
router.get('/logout',    AuthGuard, ErrorHandler(AuthController.logout));
router.get('/list-users/:page/:limit', AuthGuard, ErrorHandler(UserController.listUsers));
router.post('/create-user', AuthGuard, validate(schema.createUser), ErrorHandler(UserController.createUser));
router.post('/update-user', AuthGuard, validate(schema.updateUser), ErrorHandler(UserController.updateUser));
router.post('/delete-user', AuthGuard, validate(schema.deleteUser), ErrorHandler(UserController.deleteUser));
router.get('/get-user/:id', AuthGuard, ErrorHandler(UserController.getUserById));
router.get('/get-product/:id', AuthGuard, ErrorHandler(ProductController.getProductById));
router.get('/list-products/:page/:limit', AuthGuard, ErrorHandler(ProductController.listProducts));
router.post('/create-product', AuthGuard, upload.array('images', 5), validate(schema.createProduct), ErrorHandler(ProductController.createProduct));
router.post('/update-product', AuthGuard, validate(schema.updateProduct), ErrorHandler(ProductController.updateProduct));
router.post('/delete-product', AuthGuard, validate(schema.deleteProduct), ErrorHandler(ProductController.deleteProduct));
router.get('/list-roles/:page/:limit', AuthGuard, ErrorHandler(RoleController.listRoles));
router.post('/manage-product-image/:product_id', AuthGuard, upload.single('image'), validate(schema.productImageValidationSchema), ProductController.manageProductImage);

router.all('*',  (req, res) => res.status(400).json({ message: 'Bad Request.'}))

module.exports = router;
