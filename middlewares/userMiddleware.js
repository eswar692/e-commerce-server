const jwt = require('jsonwebtoken')
require('dotenv').config()


const userMiddleware= (req, res, next) => {
  try {
    const token = req.cookies.user_jwt;
    if (!token) {
      return res.status(401).json({ message: "token required" });
    }

    const decoded = jwt.verify(token, process.env.secret_key);
    
    req.userId = decoded._id;
   

    return next(); 
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = userMiddleware ;
