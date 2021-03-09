const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = (user_id, user_login) => {
  const payload = {
    user : {
      user_id : user_id,
      user_login : user_login
    }
  }

  return jwt.sign(payload, process.env.jwt_secret, {expiresIn : '24h'});
};
