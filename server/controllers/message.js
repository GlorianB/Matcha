const Message = require('../models/Message');
const User = require('../models/User');
const Contacts = require('../models/Contacts');

exports.getMessages = async (req, res, next) => {
  try {
    // 1. Recuperer l'id du recuperateur
    const user_id = req.user.user_id;

    // 2. Recuperer le login du currentUser
    const user_login = req.params.user_login;

    // 3. Recuperer l'id du currentUser par le biais de son login
    const user = await User.getUserByLogin(user_login);
    if (!user || !user.rows.length)
      throw `Utilisateur introuvable lors de l'envoie de message`;
    const user2_id = user.rows[0].user_id;

    // 4. Recuperer l'id de la table contact associée au 2 id
    const contacts = await Contacts.getContact(user_id, user2_id);
    if (!contacts || !contacts.rows.length)
      throw `Ces utilisateurs n'ont pas encore matché entre eux`;
    const contacts_id = contacts.rows[0].contacts_id;

    // 5. Recuperer tout les messages de la table message ayant pour contacts_id le (4)
    const messages = await Message.getMessages(contacts_id);
    if (!messages || !messages.rows.length)
      throw `Erreur lors de la recuperation des messages`;


    // 6. renvoie des messages
    return res.status(200).json(messages.rows);

  } catch (e) {
    console.error(e);
    return res.status(403).json("Erreur lors de la recuperation de messages");
  }
};

exports.addMessage = async (req, res, next) => {
  try {
    // 1. Recuperer l'id du sender
    const sender_id = req.user.user_id;

    // 2. Recuperer le receiver et le contenu du message;
    const { receiver_login, message__content } = req.body;

    // 3. Recuperer l'id du receiver par le biais de son login
    const user = await User.getUserByLogin(receiver_login);
    if (!user || !user.rows.length)
      throw `Utilisateur introuvable lors de l'envoie de message`;
    const receiver_id = user.rows[0].user_id;

    // 4. Recuperer l'id de la table contact associée au 2 id
    const contacts = await Contacts.getContact(sender_id, receiver_id);
    if (!contacts || !contacts.rows.length)
      throw `Ces utilisateurs n'ont pas encore matché entre eux`;
    const contacts_id = contacts.rows[0].contacts_id;

    // 5. Inserer le message dans la table message
    const message = await Message.addMessage(contacts_id, sender_id, message__content);
    if (!message || !message.rows.length)
      throw `Erreur lors de l'ajout du message`;

    //6. reponse
    return res.status(200).json("OK");
  } catch (e) {
    console.error(e);
    return res.status(403).json("Erreur lors de l'ajout de messages");
  }
};
