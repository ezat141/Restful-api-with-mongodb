const jwt = require('jsonwebtoken');
module.exports = async (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: 86400 // expires in 24 hours
    });
    return token;
}