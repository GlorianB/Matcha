const ORM = require('../core/ORM');

module.exports = class Visit {

  static async addVisit(visiter_id, visited_id) {
    try {
      const result = await ORM.getInstance().insert("Visit", [visiter_id, visited_id], ['visiter_id', 'visited_id']);
      return result;
    } catch (e) {
      console.error(e);
    }
  }

  static async getAllVisits(visited_id) {
    try {
      const result = ORM.getInstance().query(`SELECT user_login, user_id FROM "User" natural join "Visit" WHERE visited_id = '${visited_id}' AND user_id = visiter_id`);
      return result;
    } catch (e) {
      console.error(e);
    }
  }
};
