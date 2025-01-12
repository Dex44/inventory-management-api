const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth.controller');
const UserController = require('../controllers/user.controller');
const ProductController = require('../controllers/product.controller');
const RoleController = require('../controllers/role.controller');
const ErrorHandler = require('../middleware/error.middleware');
const AuthGuard = require('../middleware/auth.middleware');
const schema = require('../validatons/auth.validation');
const validate = require('../utils/validator.util'); 

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
router.post('/create-product', AuthGuard, validate(schema.createProduct), ErrorHandler(ProductController.createProduct));
router.post('/update-product', AuthGuard, validate(schema.updateProduct), ErrorHandler(ProductController.updateProduct));
router.post('/delete-product', AuthGuard, validate(schema.deleteProduct), ErrorHandler(ProductController.deleteProduct));
router.get('/list-roles/:page/:limit', AuthGuard, ErrorHandler(RoleController.listRoles));

router.all('*',  (req, res) => res.status(400).json({ message: 'Bad Request.'}))

module.exports = router;
