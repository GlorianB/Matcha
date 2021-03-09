const router = require('express-promise-router')();

// Validator import
const validator = require('../middlewares/validator');

// Authorizor import
const authorizor = require('../middlewares/authorizor');

// Controllers import
const tagController = require('../controllers/tag');

//Router setup

router.get('/getTag', authorizor, tagController.getTags);

router.get('/getCommonTags', authorizor, tagController.getCommonTags);

router.post('/addTag', authorizor, tagController.postTag);

router.get('/getUserTags/:user_login', authorizor, tagController.getUserTagsByLogin);

router.get('/getUserTags', authorizor, tagController.getUserTags);

router.delete('/deleteUserTag', authorizor, tagController.deleteUserTag)


module.exports = router
