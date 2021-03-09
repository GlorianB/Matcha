const jwt = require('jsonwebtoken');
require('dotenv').config();


module.exports = async (req, res, next) => {
  try {
    const token = req.headers.jwt;
    if (token === 'undefined')
      throw "No token found";
    const payload = await jwt.verify(token, process.env.jwt_secret);
    req.user = payload.user;
    next();
  } catch (e) {
    console.error("Error", req.headers, e);
    res.status(401).json("You have to be logged in to access this page");
  }
};
