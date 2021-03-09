const router = require('express-promise-router')();

// Validator import
const validator = require('../middlewares/validator');

// Authorizor import
const authorizor = require('../middlewares/authorizor');

// Controllers import
const authController = require('../controllers/auth');


//Router setup

router.get('/is_verify', authorizor, authController.is_verify);

router.post('/register', validator.registerValidator, authController.postRegister);

router.post('/login', validator.loginValidator, authController.postLogin);

router.get('/logout', authorizor, authController.getLogout);

router.get('/validate/:login/:vtoken', authController.getValidate);

router.post('/forgot', validator.forgotValidator, authController.postForgot);

router.post('/recover/:login/:ftoken', validator.recoverValidator, authController.postRecover);

module.exports = router
