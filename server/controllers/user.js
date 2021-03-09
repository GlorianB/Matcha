const User = require('../models/User');
const Usertag = require('../models/Usertag');

exports.getSelf = async (req, res, next) => {
  try {
    const user = await User.getUser(req.user.user_id);
    return res.status(200).json(user.rows[0]);
  } catch (e) {
    console.error(e.message);
    return res.status(500).json(JSON.stringify("Server error"));
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const { user_login } = req.params;
    const user = await User.getUserByLogin(user_login);
    if (!user.rows.length)
      return res.status(403).json('error');
    return res.status(200).json(user.rows[0]);
  } catch (e) {
    console.error(e.message);
    return res.status(500).json(JSON.stringify("Server error"));
  }
};

exports.getUserById = async (res, req, next) => {
  try {
  } catch (e) {
    console.error(e.message);
    return res.status(500).json(JSON.stringify("Server error"));
  }
}

exports.postSelf = async (req, res, next) => {
  try {
    const body = {
      login : req.body.login,
      firstname : req.body.firstname,
      lastname : req.body.lastname,
      email : req.body.email,
      age : req.body.age,
      genre : req.body.genre,
      orientation : req.body.orientation,
      bio : req.body.bio,
      locpreference : req.body.locpreference,
      tags : req.body.tagList
    };

    const user = await User.update(req.user.user_id, body);
    const usertag = await Usertag.addUserTags(req.user.user_id, body.tags);
    if (user === "OK" && usertag === "OK")
      return res.status(200).send(JSON.stringify("OK"));
    if (user !== "OK")
      return res.status(403).send(JSON.stringify(user));
    return res.status(403).send(usertag);
  } catch (e) {
    console.error(e.message);
    return res.status(500).json(JSON.stringify('Server error'));
  }
};

exports.postChangePassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const user = await User.updatePassword(req.user.user_id, { password });
    if (user === "OK")
      return res.status(200).send(JSON.stringify("OK"));
    return res.status(403).send("Erreur lors de la modification du mot de passe");
  } catch (e) {
    console.error(e.message);
    return res.status(500).json(JSON.stringify('Server error'));
  }
};

exports.postPosition = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;
    const user = await User.updatePosition(req.user.user_id, { latitude, longitude });
    if (user === "OK")
      return res.status(200).send(JSON.stringify("OK"))
    return res.status(403).send(user);
  } catch (e) {
    console.error(e.message);
    return res.status(500).json(JSON.stringify('Server error'));
  }
};

exports.getComplete = async (req, res, next) => {
  try {
    const sqlResult = await User.getUser(req.user.user_id);
    const user = sqlResult.rows[0];
    if (!user.user_age || !user.user_image || !user.user_bio || !user.user_genre || !user.user_orientation)
      return res.status(403).send(JSON.stringify(JSON.stringify('redirect')));
    return res.status(200).send(JSON.stringify("OK"));
  } catch (e) {
    console.error(e.message);
    return res.status(500).json(JSON.stringify('Server error'));
  }
};
