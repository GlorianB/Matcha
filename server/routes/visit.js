const router = require('express-promise-router')();

// Validator import
const validator = require('../middlewares/validator');

// Authorizor import
const authorizor = require('../middlewares/authorizor');

// Controllers import
const visitController = require('../controllers/visit');


///Router setup

router.post('/addVisit/:visited_login', authorizor, visitController.postVisit);

router.get('/getVisits', authorizor, visitController.getVisits);

module.exports = router;
