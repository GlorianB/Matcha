const router = require('express-promise-router')();

// Validator import
const validator = require('../middlewares/validator');

// Authorizor import
const authorizor = require('../middlewares/authorizor');

// Controllers import
const imageController = require('../controllers/image');

//Router setup

router.get('/:user/photoProfile', imageController.readImage);

router.get('/:user/photo/:numero', imageController.readSecondaryImage);

router.post('/addProfileImage', authorizor, imageController.addProfileImage);

router.post('/addSecondaryImage/:numero', authorizor, imageController.addSecondaryImage);

module.exports = router;
