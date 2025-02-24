const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const AuthController = require('../controllers/auth.controller');
const UserController = require('../controllers/user.controller');
const ProductController = require('../controllers/product.controller');
const RoleController = require('../controllers/role.controller');
const ClientController = require('../controllers/client.controller');
const InvoiceController = require('../controllers/invoice.controller');
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
router.post('/list-users', AuthGuard, validate(schema.pagination), ErrorHandler(UserController.listUsers));
router.post('/create-user', AuthGuard, validate(schema.createUser), ErrorHandler(UserController.createUser));
router.post('/update-user', AuthGuard, validate(schema.updateUser), ErrorHandler(UserController.updateUser));
router.post('/delete-user', AuthGuard, validate(schema.deleteUser), ErrorHandler(UserController.deleteUser));
router.get('/get-user/:id', AuthGuard, ErrorHandler(UserController.getUserById));
router.get('/get-product/:id', AuthGuard, ErrorHandler(ProductController.getProductById));
router.get('/get-client/:id', AuthGuard, ErrorHandler(ClientController.getClientById));
router.post('/list-products', AuthGuard, validate(schema.pagination), ErrorHandler(ProductController.listProducts));
router.post('/create-product', AuthGuard, upload.single('image'), validate(schema.createProduct), ErrorHandler(ProductController.createProduct));
router.post('/update-product', AuthGuard, upload.single('image'), validate(schema.updateProduct), ErrorHandler(ProductController.updateProduct));
router.post('/delete-product', AuthGuard, validate(schema.deleteProduct), ErrorHandler(ProductController.deleteProduct));
router.post('/list-roles', AuthGuard, validate(schema.pagination), ErrorHandler(RoleController.listRoles));
router.post('/manage-product-image/:product_id', AuthGuard, upload.single('image'), validate(schema.productImageValidationSchema), ProductController.manageProductImage);
router.post('/create-client', AuthGuard, validate(schema.createClient), ErrorHandler(ClientController.createClient));
router.post('/update-client', AuthGuard, validate(schema.updateClient), ErrorHandler(ClientController.updateClient));
router.post('/delete-client', AuthGuard, validate(schema.deleteClient), ErrorHandler(ClientController.deleteClient));
router.post('/list-clients', AuthGuard, validate(schema.pagination), ErrorHandler(ClientController.listClients));
router.post('/create-invoice', AuthGuard, validate(schema.createInvoice), ErrorHandler(InvoiceController.createInvoice));
router.post('/update-invoice', AuthGuard, validate(schema.updateInvoice), ErrorHandler(InvoiceController.updateInvoice));
router.post('/list-invoice', AuthGuard, validate(schema.pagination), ErrorHandler(InvoiceController.getInvoice));

router.all('*',  (req, res) => res.status(400).json({ message: 'Bad Request.'}))

module.exports = router;
