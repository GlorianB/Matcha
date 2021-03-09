const ORM = require('../core/ORM');

module.exports = class Message {

  static async getMessages(contacts) {
    try {
      const result = ORM.getInstance().query(`SELECT
          user_login, user_image, message_content, message_date FROM "Message" natural join "User"
          where user_id = sender_id and contacts_id = '${contacts}' ORDER BY message_date ASC`);
      // const result = ORM.getInstance().select("Message", { 'contacts_id' : contacts }, ['message_date', 'DESC']);
      return result;
    } catch (e) {
      console.error(e);
    }
  }

  static async addMessage(contacts, sender, content) {
    try {
      const result = ORM.getInstance().query(`INSERT INTO "Message" (contacts_id, sender_id, message_content, message_date)
                                              VALUES ('${contacts}', '${sender}', '${content}', CURRENT_TIMESTAMP) RETURNING *`);
      return result;
    } catch (e) {
      console.error(e);
    }
  }
}
