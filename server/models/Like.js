const ORM = require('../core/ORM');

module.exports = class Like {

  static async getAllLikes(liked_id) {
    try {
      const result = ORM.getInstance().query(`SELECT user_login, user_id FROM "User" natural join "Like" WHERE liked_id = '${liked_id}' AND user_id = liker_id`);
      return result;
    } catch (e) {
      console.error(e);
    }
  }

  static async getLike(liker_id, liked_id) {
    try {
      const result = ORM.getInstance().select("Like", { "liker_id" : liker_id , 'liked_id' : liked_id });
      return result;
    } catch (e) {
      console.error(e);
    }
  }

  static async addLike(liker_id, liked_id) {
    try {
      const result = ORM.getInstance().insert("Like", [liker_id, liked_id], ['liker_id', 'liked_id']);
      return result;
    } catch (e) {
      console.error(e);
    }
  }

  static async deleteLike(liker_id, liked_id) {
    try {
      const result = ORM.getInstance().delete("Like", { liker_id, liked_id });
      return result;
    } catch (e) {
      console.error(e);
    }
  }
}
