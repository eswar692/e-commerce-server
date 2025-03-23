const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.user_jwt;
    if (!token) {
        return res.status(403).json({ success: false, message: 'No token provided.' });
    }

   const decoded =  jwt.verify(token, process.env.secret_key)
        if (!decoded) {
            return res.status(500).json({ success: false, message: 'Failed to authenticate token.' });
        }

        req.userId = decoded._id;
        next();
    
};

module.exports = verifyToken;