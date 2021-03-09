const router = require('express-promise-router')();

// Validator import
const validator = require('../middlewares/validator');

// Authorizor import
const authorizor = require('../middlewares/authorizor');

// Controllers import
const likeController = require('../controllers/like');


///Router setup

router.get('/getAllLikes', authorizor, likeController.getLikes);

// Permet de savoir si un autre utilisateur like le client
router.get('/:liker_login', authorizor, likeController.getLike);

//Permet de savoir si le client like l'utilisateur :liked_login:
router.get('/check/:liked_login', authorizor, likeController.checkLike);

router.post('/addLike/:liked_login', authorizor, likeController.postLike);

router.delete('/delete/:liked_login', authorizor, likeController.deleteLike);

module.exports = router;
