const router = require('express-promise-router')();

// Validator import
const validator = require('../middlewares/validator');

// Authorizor import
const authorizor = require('../middlewares/authorizor');

// Controllers import
const blockedController = require('../controllers/blocked');

///Router setup


//Permet de savoir si le client block l'utilisateur :blocked_login:
router.get('/check/:blocked_login', authorizor, blockedController.checkBlocked);

router.post('/addBlock/:blocked_login', authorizor, blockedController.postBlocked);

router.delete('/delete/:blocked_login', authorizor, blockedController.deleteBlocked);

module.exports = router;
