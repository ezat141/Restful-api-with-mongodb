const jwt = require('jsonwebtoken');
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');

const verifyToken = (req, res, next) => {

    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    
    if(!authHeader) {
        const error = appError.create('token is required', 401, httpStatusText.ERROR)
        return next(error);
    }
    const token = authHeader.split(' ')[1];

    try {
        const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.currentUser = currentUser; // returned: email, id, iat, exp 
        next();
        
    } catch (err) {
        const error = appError.create('token is invalid', 401, httpStatusText.ERROR)
        return next(error);
        
    }
}

module.exports = verifyToken;