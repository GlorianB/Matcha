const router = require('express-promise-router')();

// Validator import
const validator = require('../middlewares/validator');

// Authorizor import
const authorizor = require('../middlewares/authorizor');

// Controllers import
const contactsController = require('../controllers/contacts');


///Router setup

router.get('/check/:contact2_login', authorizor, contactsController.checkContacts);

router.get('/getcontacts', authorizor, contactsController.getContactList)

module.exports = router;
