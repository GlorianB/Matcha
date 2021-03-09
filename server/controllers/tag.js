const Tag = require('../models/Tags');
const Usertag = require('../models/Usertag');

exports.getTags = async (req, res, next) => {
  try {
    const tags = await Tag.getAll();
    return res.status(200).json(tags.rows);
  } catch (e) {
    console.error(e.message);
    return res.status(403).json("Erreur lors de la recuperation des tags");
  }
};

exports.postTag = async (req, res, next) => {
  try {
    let { newTag } = req.body;
    newTag = newTag.trim();
    if (newTag === '')
      return res.status(403).json("Ce tag est vide");
    const tag = await Tag.addTag(newTag);
    if (tag === "OK")
      return res.status(200).json("OK");
    else
      return res.status(403).json(tag);
  } catch (e) {
    console.error(e.message);
    return res.status(403).json("Erreur lors de l'ajout du tag");
  }
};

exports.getUserTags = async (req, res, next) => {
  try {
    const usertags = await Usertag.getTagsByUserId(req.user.user_id);
    if (usertags.constructor === Array) {
      let response = [];
      for (const tags of usertags)
        response.push({ 'value': tags.tag_name, 'label' : tags.tag_name });
      return res.status(200).json(response);
    }
    else
      return res.status(403).json("Erreur lors de la recuperation des tags de l'utilisateurs")
  } catch (e) {
    console.error(e.message);
    return res.status(403).json(`Erreur lors de la récupération des tags de l'utilisateur`);
  }
};

exports.getUserTagsByLogin = async (req, res, next) => {
  try {
    const { user_login } = req.params;
    const usertags = await Usertag.getTagsByUserLogin(user_login);
    if (usertags && usertags.constructor === Array) {
      let response = [];
      for (const tags of usertags)
        response.push({ 'value': tags.tag_name, 'label' : tags.tag_name });
      return res.status(200).json(response);
    }
    else
      return res.status(403).json("Erreur lors de la recuperation des tags de l'utilisateurs")
  } catch (e) {
    console.error(e.message);
    return res.status(403).json(`Erreur lors de la récupération des tags de l'utilisateur`);
  }
};

exports.deleteUserTag = async (req, res, next) => {
  try {
    const tagToDelete = req.body.tag.value;
    const tag_id = await Tag.getTagByName(tagToDelete);
    const checkTag = await Usertag.getTags(req.user.user_id, tag_id);
    if (!checkTag.length)
      return res.status(200).json("OK");
    const deletedTag = await Usertag.delete(req.user.user_id, tagToDelete);
    console.log(deletedTag);
    if (deletedTag === "OK")
      return res.status(200).json("OK");
    return res.status(403).json(deletedTag);
  } catch (e) {
    console.error(e.message);
    return res.status(403).json("Erreur lors de la suppression d'un tag utilisateur");
  }
};

exports.getCommonTags = async (req, res, next) => {
  try {
    const commonTags = await Tag.getCommonTags();
    return res.status(200).json(commonTags);
  } catch (e) {
    console.error(e.message);
    return res.status(403).json("Erreur lors de la recuperation des tags en communs");
  }
};
