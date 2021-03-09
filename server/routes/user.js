const router = require('express-promise-router')();

// Validator import
const validator = require('../middlewares/validator');

// Authorizor import
const authorizor = require('../middlewares/authorizor');

// Controllers import
const userController = require('../controllers/user');

//Router setup

router.get('/complete', authorizor, userController.getComplete)

router.get('/self', authorizor, userController.getSelf);

router.get('/:user_login', authorizor, userController.getUser);

router.post('/self/changePassword', authorizor, validator.passwordValidator, userController.postChangePassword);

router.post('/self', authorizor,  validator.profileValidator, userController.postSelf);

router.put('/postPosition', authorizor, userController.postPosition);

module.exports = router
