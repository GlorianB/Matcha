const ORM = require('../core/ORM');

module.exports = class Contact {

  static async getContactList(contact) {
    try {
      const result = await ORM.getInstance().query(` select u2.user_login, u2.user_firstname, u2.user_lastname, u2.user_image from "Contacts"
      inner join "User" AS u1 ON contact1 = u1.user_id
      inner join "User" AS u2 ON contact2 = u2.user_id
      where u1.user_id='${contact}' UNION
      select u2.user_login, u2.user_firstname, u2.user_lastname, u2.user_image from "Contacts"
      inner join "User" AS u1 ON contact2 = u1.user_id inner join
      "User" AS u2 ON contact1 = u2.user_id
      where u1.user_id='${contact}'`);
      return result;
    } catch (e) {
      console.error(e);
    }
  }

  static async getContact(contact1, contact2) {
    try {
      const result = await ORM.getInstance().query(`SELECT * FROM "Contacts" where (contact1='${contact1}' AND contact2='${contact2}') OR (contact1='${contact2}' AND contact2='${contact1}')`);
      return result;
    } catch (e) {
      console.error(e);
    }
  }

  static async addContact(contact1, contact2) {
    try {
      const result = await ORM.getInstance().insert("Contacts", [contact1, contact2], ['contact1', 'contact2']);
      return result;
    } catch (e) {
      console.error(e);
    }
  }

  static async delContact(contact1, contact2) {
    try {
      const result = await ORM.getInstance().query(`DELETE FROM "Contacts"  where (contact1='${contact1}' AND contact2='${contact2}') OR (contact1='${contact2}' AND contact2='${contact1}')`);
      return result
    } catch (e) {
      console.error(e);
    }
  }
}
