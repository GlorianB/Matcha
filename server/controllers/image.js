const path = require('path');
const User = require('../models/User');

exports.addProfileImage = async (req, res, next) => {
  try {
    const photoProfile = req.files.photoProfile;
    const types = ['.png', '.jpg', '.jpeg', '.gif'];

    // Check format: l'image doit etre un fichier
    if (types.indexOf(path.extname(photoProfile.name)) === -1)
      return res.status(403).json("Ce fichier n'est pas une image");

    // Check taille: l'image doit faire au maximum 2 MB
    if (photoProfile.size > 2 * 1024 * 1024)
      return res.status(403).json("Ce fichier est beaucoup trop grand");

    const image = await User.addProfileImage(req.user.user_id, photoProfile);
    if (image === "OK")
      return res.status(200).json("OK");
    return res.status(403).json(image);
  } catch (e) {
    console.error(e.message);
  }
};

exports.addSecondaryImage = async (req, res, next) => {
  try {
    const photo = req.files['photo' + req.params.numero];
    const types = ['.png', '.jpeg', '.gif'];

    // Check format: l'image doit etre un fichier
    if (types.indexOf(path.extname(photo.name)) === -1)
      return res.status(403).json("Ce fichier n'est pas une image");

    // Check taille: l'image doit faire au maximum 2 MB
    if (photo.size > 2 * 1024 * 1024)
      return res.status(403).json("Ce fichier est beaucoup trop grand");

    const image = await User.addSecondaryImage(req.user.user_id, photo, req.params.numero);
    if (image === "OK")
      return res.status(200).json("OK");
    return res.status(403).json(image);
  } catch (e) {
    console.error(e.message);
  }
};

exports.readImage = async (req, res, next) => {
  try {
    const user_login = req.params.user;
    const filepath = `${process.cwd()}/image/${user_login}/photoProfile`;
    res.set({'Content-Type': 'image/png'});
    return res.status(200).sendFile(filepath)
  } catch (e) {
    console.error(e.message);
  }
};

exports.readSecondaryImage = async (req, res, next) => {
  try {
    const user_login = req.params.user;
    const filepath = `${process.cwd()}/image/${user_login}/photo${req.params.numero}`;
    res.set({'Content-Type': 'image/png'});
    return res.status(200).sendFile(filepath)
  } catch (e) {
    console.error(e.message);
  }
};
