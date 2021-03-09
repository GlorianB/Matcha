const User = require('../models/User');
const Like = require('../models/Like');
const Contacts = require('../models/Contacts');

exports.getLikes = async (req, res, next) => {
  try {
    const liked_id = req.user.user_id;
    const likers = await Like.getAllLikes(liked_id);
    let result = [];
    for (const liker of likers.rows)
      result.push(liker.user_login);
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(403).json("Erreur lors de .");
  }
};

exports.checkLike = async (req, res, next) => {
  try {
    const liker_id = req.user.user_id;
    const liked_login = req.params.liked_login;
    const liked = await User.getUserByLogin(liked_login);
    if (!liked || !liked.rows.length)
      throw `Utilisateur introuvable lors de l'ajout de like`;
    const liked_id = liked.rows[0].user_id;
    const like = await Like.getLike(liker_id, liked_id);
    if (like.rows.length)
      return res.status(200).json(true);
    return res.status(200).json(false);
  } catch (e) {
    console.error(e);
    return res.status(403).json('error');
  }
};

exports.getLike = async (req, res, next) => {
  try {
    const liked_id = req.user.user_id;
    const liker_login = req.params.liker_login;
    const liker = await User.getUserByLogin(liker_login);
    if (!liker || !liker.rows.length)
      throw `Utilisateur introuvable lors de get like`;
    const liker_id = liker.rows[0].user_id;
    const like = await Like.getLike(liker_id, liked_id);
    if (like.rows.length)
      return res.status(200).json(true);
    return res.status(200).json(false);
  } catch (e) {
    console.error(e);
    return res.status(403).json('error');
  }
};

exports.postLike = async (req, res, next) => {
  try {
    const liker_id = req.user.user_id;
    const liked_login = req.params.liked_login;
    const liked = await User.getUserByLogin(liked_login);
    if (!liked || !liked.rows.length)
      throw `Utilisateur introuvable lors de l'ajout de like`;
    const liked_id = liked.rows[0].user_id;
    const liked_score = parseInt(liked.rows[0].user_score) + 2;
    const like = await Like.addLike(liker_id, liked_id);
    if (!like)
      throw `Erreur lors de l'ajout du like pour ${liked_login}`;
    const increaseScore = User.updateScore(liked_id, liked_score);
    if (!increaseScore)
      throw `Erreur lors de l'augmentation du score`;
    const checkLike = await Like.getLike(liked_id, liker_id);
    if (checkLike.rows.length) {
      const contact = await Contacts.getContact(liker_id, liked_id);
      if (!contact.rows.length) {
        const addContact = await Contacts.addContact(liker_id, liked_id);
        if (!addContact)
          throw "Erreur lors de l'ajout d'un contact";
      }
    }
    return res.status(200).send(JSON.stringify("OK"));
  } catch (e) {
    console.error(e);
    return res.status(403).send("Erreur lors de l'ajout de like");
  }
};

exports.deleteLike = async (req, res, next) => {
  try {
    const liker_id = req.user.user_id;
    const liked_login = req.params.liked_login || req.params.blocked_login;
    const liked = await User.getUserByLogin(liked_login);
    if (!liked || !liked.rows.length)
      throw `Utilisateur introuvable lors de la suppression de like`;
    const liked_id = liked.rows[0].user_id;
    const liked_score = parseInt(liked.rows[0].user_score) - 2;
    const like = await Like.deleteLike(liker_id, liked_id);
    if (!like)
      throw `Erreur lors de la suppression du like pour ${liked_login}`;
    const decreaseScore = User.updateScore(liked_id, liked_score);
    if (!decreaseScore)
        throw `Erreur lors de l'augmentation du score`;
    const contact = await Contacts.getContact(liker_id, liked_id);
    if (contact.rows.length) {
      const delContact = await Contacts.delContact(liker_id, liked_id);
      if (!delContact)
        throw "Erreur lors de la suppression d'un contact";
    }
    return res.status(200).json("OK");
  } catch (e) {
    console.error(e);
    return res.status(403).json("Erreur lors de la suppression de like");
  }
};
