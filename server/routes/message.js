const router = require('express-promise-router')();

// Validator import
const validator = require('../middlewares/validator');

// Authorizor import
const authorizor = require('../middlewares/authorizor');

// Controllers import
const messageController = require('../controllers/message');


///Router setup

router.get('/getMessages/:user_login', authorizor, messageController.getMessages);

router.post('/send', authorizor, messageController.addMessage);


module.exports = router;
