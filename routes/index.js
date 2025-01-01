const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth.controller');
const UserController = require('../controllers/user.controller');
const ProductController = require('../controllers/product.controller');
const ErrorHandler = require('../middleware/error.middleware');
const AuthGuard = require('../middleware/auth.middleware');
const schema = require('../validatons/auth.validation');
const validate = require('../utils/validator.util'); 

router.post('/register', validate(schema.register), ErrorHandler(AuthController.register));
router.post('/login',    validate(schema.login),    ErrorHandler(AuthController.login));
router.get('/user',      AuthGuard,                 ErrorHandler(UserController.getUser));
router.get('/logout',    AuthGuard,                 ErrorHandler(AuthController.logout));
router.post('/create-user', AuthGuard, validate(schema.createUser), ErrorHandler(UserController.createUser));
router.post('/update-user', AuthGuard, validate(schema.updateUser), ErrorHandler(UserController.updateUser));
router.post('/delete-user', AuthGuard, validate(schema.deleteUser), ErrorHandler(UserController.deleteUser));
router.post('/create-product', AuthGuard, validate(schema.createProduct), ErrorHandler(ProductController.createProduct));
router.post('/update-product', AuthGuard, validate(schema.updateProduct), ErrorHandler(ProductController.updateProduct));
router.post('/delete-product', AuthGuard, validate(schema.deleteProduct), ErrorHandler(ProductController.deleteProduct));

router.all('*',  (req, res) => res.status(400).json({ message: 'Bad Request.'}))

module.exports = router;
