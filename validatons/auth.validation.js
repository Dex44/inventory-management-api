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
  createProduct: Joi.object().keys({
    product_name: Joi.string().required(),
    description: Joi.string().required(),
    quantity: Joi.number().required(),
    price: Joi.number().required(),
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
};
