const User = require('../models/User');
const Blocked = require('../models/Blocked');
const Like = require('../models/Like');
const Contacts = require('../models/Contacts');

exports.checkBlocked = async (req, res, next) => {
  try {
    const blocker_id = req.user.user_id;
    const blocked_login = req.params.blocked_login;
    const blocked = await User.getUserByLogin(blocked_login);
    if (!blocked || !blocked.rows.length)
      throw `Utilisateur introuvable lors de l'ajout de block`;
    const blocked_id = blocked.rows[0].user_id;
    const block = await Blocked.getBlocked(blocker_id, blocked_id);
    if (block.rows.length)
      return res.status(200).json(true);
    return res.status(200).json(false);
  } catch (e) {
    console.error(e);
    return res.status(403).json('error');
  }
};

exports.postBlocked = async (req, res, next) => {
  try {
    const blocker_id = req.user.user_id;
    const blocked_login = req.params.blocked_login;
    const blocked = await User.getUserByLogin(blocked_login);
    if (!blocked || !blocked.rows.length)
      throw `Utilisateur introuvable lors de l'ajout de block`;
    const blocked_id = blocked.rows[0].user_id;
    const blocked_score = parseInt(blocked.rows[0].user_score) - 2;
    const block = await Blocked.addBlocked(blocker_id, blocked_id);
    if (!block)
      throw `Erreur lors de l'ajout du block pour ${blocked_login}`;
    const like = await Like.deleteLike(blocker_id, blocked_id);
    if (!like)
      throw `Erreur lors de la suppression du like pour ${liked_login}`;
    const decreaseScore = User.updateScore(blocked_id, blocked_score);
    if (!decreaseScore)
      throw `Erreur lors de l'augmentation du score`;
    const contact = await Contacts.getContact(blocker_id, blocked_id);
    if (contact.rows.length) {
      const delContact = await Contacts.delContact(blocker_id, blocked_id);
      if (!delContact)
        throw "Erreur lors de la suppression d'un contact";
    }
    return res.status(200).json("OK");
  } catch (e) {
    console.error(e);
    return res.status(403).json("Erreur lors de l'ajout de block");
  }
};

exports.deleteBlocked = async (req, res, next) => {
  try {
    const blocker_id = req.user.user_id;
    const blocked_login = req.params.blocked_login;
    const blocked = await User.getUserByLogin(blocked_login);
    if (!blocked || !blocked.rows.length)
      throw `Utilisateur introuvable lors de l'ajout de block`;
    const blocked_id = blocked.rows[0].user_id;
    const block = await Blocked.deleteBlocked(blocker_id, blocked_id);
    if (!block)
      throw `Erreur lors de la suppression du block pour ${blocked_login}`;
    return res.status(200).json("OK");
  } catch (e) {
    console.error(e);
    return res.status(403).json("Erreur lors de la suppression de block");
  }
};
