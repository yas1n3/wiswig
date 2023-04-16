const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = {

  verifyToken: (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(403).json({ messages: 'No token provided' });
    }

    return jwt.verify(token, "Hakona_Matata", (err, decoded) => {
      if (err) {
        if (err.expiredAt < new Date()) {
          return res.status(400).json({ message: 'Token has expired', token: null });
        }
        return res.status(401).json({ message: 'Invalid or expired token', token: null });
      }
      req.user = decoded.data;
      next();
    });

  }

};
