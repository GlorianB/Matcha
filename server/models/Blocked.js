const ORM = require('../core/ORM');

module.exports = class Blocked {

  static async getBlocked(blocker_id, blocked_id) {
    try {
      const result = ORM.getInstance().select("Blocked", { "blocker_id" : blocker_id , 'blocked_id' : blocked_id });
      return result;
    } catch (e) {
      console.error(e);
    }
  }

  static async addBlocked(blocker_id, blocked_id) {
    try {
      const result = ORM.getInstance().insert("Blocked", [blocker_id, blocked_id], ['blocker_id', 'blocked_id']);
      return result;
    } catch (e) {
      console.error(e);
    }
  }

  static async deleteBlocked(blocker_id, blocked_id) {
    try {
      const result = ORM.getInstance().delete("Blocked", { blocker_id, blocked_id });
      return result;
    } catch (e) {
      console.error(e);
    }
  }
};
