const router = require('express-promise-router')();

// Validator import
const validator = require('../middlewares/validator');

// Authorizor import
const authorizor = require('../middlewares/authorizor');

// Controllers import
const matchController = require('../controllers/match');


//Router setup

router.post('/', authorizor, matchController.match);

module.exports = router;
