const AuthService = require('../services/auth.service');
const jwtConfig = require('../config/jwt.config');
const bcryptUtil = require('../utils/bcrypt.util');
const jwtUtil = require('../utils/jwt.util');

exports.register = async (req, res) => { 
    const isExist = await AuthService.findUserByEmail(req.body.email);
    if(isExist) {
        return res.status(400).json({ 
            message: 'Email already exists.' 
        });
    }
    const hashedPassword = await bcryptUtil.createHash(req.body.password);
    const userData = {
        username: req.body.name,
        email: req.body.email,
        role_id: 1,
        password_hash: hashedPassword
    }
    
    const user = await AuthService.createUser(userData);
    return res.json({
        data: user,
        message: 'User registered successfully.'
    });
}

exports.login = async (req, res) => { 
    const user = await AuthService.findUserByEmail(req.body.email); 
    if (user) {
        const isMatched = await bcryptUtil.compareHash(req.body.password, user.password_hash);
        
        if (isMatched) {
            const token = await jwtUtil.createToken({ id: user.user_id });
            await AuthService.updateUser({ user_id: user.user_id, token: token });  
            const userDeails = await AuthService.getUserDetailsById(user.user_id);
             
            return res.json({
                ...userDeails,
                access_token: token,
                token_type: 'Bearer',
                expires_in: jwtConfig.ttl
            });
        }
    }
    return res.status(400).json({ message: 'Unauthorized.' });
}

exports.logout = async (req, res) => {    
    await AuthService.logoutUser(req.token, req.user.exp);  
    return res.json({ message: 'Logged out successfully.' });
}