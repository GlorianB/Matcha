const Contacts = require('../models/Contacts');
const User = require('../models/User');

exports.checkContacts = async (req, res, next) => {
  try {
    const contact1 = req.user.user_id;
    const contact2_login = req.params.contact2_login;
    const contact2 = await User.getUserByLogin(contact2_login);
    if (!contact2 || !contact2.rows.length)
      throw `Utilisateur introuvable lors de l'ajout de like`;
    const contact2_id = contact2.rows[0].user_id;
    const contact = await Contacts.getContact(contact1, contact2_id);
    if (contact.rows.length)
      return res.status(200).json(true);
    return res.status(200).json(false);
  } catch (e) {
    console.error(e);
    return res.status(403).json('Error checkContacts');
  }
};

exports.getContactList = async (req, res, next) => {
  try {
    const contact = req.user.user_id;
    const result = await Contacts.getContactList(contact);
    if (!result || !result.rows.length)
      return res.status(200).json([]);
    return res.status(200).json(result.rows);
  } catch (e) {
    console.error(e);
    return res.status(403).json('Error getContactList');
  }
}
