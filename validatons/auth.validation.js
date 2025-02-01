const Joi = require("joi");
const passwordRegex = new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/);

const validatePassword = (value) => {
  if (!passwordRegex.test(String(value))) {
    throw new Error(
      "Password should contains a lowercase, a uppercase character and a digit."
    );
  }
};

module.exports = {
  register: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(16).required().external(validatePassword),
  }),
  login: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  createUser: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.number().required(),
    password: Joi.string().min(8).max(16).required().external(validatePassword),
  }),
  updateUser: Joi.object().keys({
    user_id: Joi.number().required(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.number().required(),
  }),
  deleteUser: Joi.object().keys({
    user_id: Joi.number().required(),
  }),
  createProduct: Joi.object({
    product_name: Joi.string().trim().required(),
    description: Joi.string().trim().optional(),
    quantity: Joi.number().integer().positive().required(),
    price: Joi.number().positive().required(),
    images: Joi.array().items(
      Joi.object({
        originalname: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required(),
        size: Joi.number().max(2 * 1024 * 1024) // Max 2MB
      })
    ).min(1).max(5) // Min 1 image, max 5 images
  }),
  updateProduct: Joi.object().keys({
    product_id: Joi.number().required(),
    product_name: Joi.string().required(),
    description: Joi.string().required(),
    quantity: Joi.number().required(),
    price: Joi.number().required(),
  }),
  deleteProduct: Joi.object().keys({
    product_id: Joi.number().required(),
  }),
  productImageValidationSchema: Joi.object({
    action: Joi.string()
      .valid('add', 'remove', 'update')
      .required()
      .messages({
        'any.only': 'Action must be one of "add", "remove", or "update".',
        'any.required': 'Action is required.'
      }),
  
    image_id: Joi.number()
      .when('action', {
        is: Joi.valid('remove', 'update'),
        then: Joi.required().messages({
          'any.required': 'Image ID is required for remove and update actions.'
        }),
        otherwise: Joi.optional()
      }),
  
    image: Joi.object()
      .when('action', {
        is: 'add',
        then: Joi.object({
          mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/jpg', 'image/gif').required(),
          size: Joi.number().max(5 * 1024 * 1024).required() // Maximum size: 5MB
        }).required().messages({
          'any.required': 'Image file is required for add action.',
          'string.valid': 'Only image files are allowed (JPG, PNG, JPEG, GIF).',
          'number.max': 'Image size cannot exceed 5MB.'
        }),
        otherwise: Joi.optional()
      }),
  }),
};
