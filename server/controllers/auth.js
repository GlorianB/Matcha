const User = require('../models/User');
const createDir = require('../utils/createImageDir');

exports.postRegister = async (req, res, next) => {
  try {
    const {login, password, email, firstname, lastname} = req.body;
    const registration = await User.register(login, password, email, firstname, lastname);
    if (registration.error)
      return res.status(403).json(registration.error);
    createDir(login);
    return res.status(200).json(registration.success);
  } catch (e) {
    console.error(e.message);
    return res.status(500).send(JSON.stringify("Server error"));
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const { login, password } = req.body;
    const result = await User.login(login, password);
    if (result.jwt)
      return res.status(200).send(result);
    return res.status(403).send(JSON.stringify(result));
  } catch (e) {
    console.error(e.message);
    return res.status(500).send(JSON.stringify("Server error"));
  }
};

exports.getLogout = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const user = await User.logout(user_id);
    if (user === 'OK')
      return res.status(200).send("Deconnecté avec succes !");
    return res.status(403).send("Erreur lors de la deconnexion");
  } catch (e) {
    console.error(e.message);
    return res.status(500).send(JSON.stringify("Server error"));
  }
};

exports.getValidate = async (req, res, next) => {
  try {
    const { login, vtoken } = req.params;
    const validation = await User.validate(login, vtoken);
    if (validation === "OK")
      return res.status(200).json("Vous pouvez maintenant vous connectez");
    return res.status(403).json(validation);
  } catch (e) {
    console.error(e.message);
    return res.status(500).send(JSON.stringify('Server error'));
  }
};

exports.postForgot = async (req, res, next) => {
  try {
    const { login, email } = req.body;
    const forgot = await User.forgot(login, email);
    if (forgot === "OK")
      return res.status(200).json("Un email de réinitialisation a été envoyé a l'adresse " + email);
    return res.status(403).json(forgot);
  } catch (e) {
    console.error(e.message);
    return res.status(500).send(JSON.stringify('Server error'));
  }
};

exports.postRecover = async (req, res, next) => {
  try {
    const { login, ftoken } = req.params;
    const { password, confirmPassword } = req.body;
    if (!(password === confirmPassword))
      return res.status(403).json(JSON.stringify("Les mot de passes ne matchent pas"));
    const recover = await User.recover(login, password, ftoken);
    if (recover === "OK")
      return res.status(200).json("Votre mot de passe a été réinitialisé");
    return res.status(403).json(JSON.stringify(recover));
  } catch (e) {
    console.error(e.message);
    return res.status(500).send(JSON.stringify('Server error'));
  }
};

exports.is_verify = async (req, res, next) => {
  try {
    return res.status(200).json({ auth : true, user_login : req.user.user_login});
  } catch (e) {
    //console.error(e.message);
    return res.status(500).send(JSON.stringify("Server error"));
  }
};
