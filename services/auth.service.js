// const UserModel = require('../models/user.model');
const { User } = require('../models/mysql');
const cacheUtil = require('../utils/cache.util');

exports.createUser = (user) => {
    return User.create(user);
}

exports.findUserByEmail = (email) => {
    return User.findOne({
        where: {
            email: email
        }
    })
}

exports.findUserById = (user_id) => {
    return User.findByPk(user_id);
}

exports.logoutUser = (token, exp) => {
    const now = new Date();
    const expire = new Date(exp * 1000);
    const milliseconds = expire.getTime() - now.getTime();
    /* ----------------------------- BlackList Token ---------------------------- */
    return cacheUtil.set(token, token, milliseconds);
}