const ORM = require('../core/ORM');

module.exports = class Tags {

  static async addTag(newTag) {
    try {
      const verifTag = await ORM.getInstance().select("Tag", {'tag_name' : newTag});
      if (verifTag.rows.length > 0)
        return "OK";
      const tag = await ORM.getInstance().insert("Tag", [newTag], ['tag_name'])
      if (tag)
        return "OK";
      else
        return "Une erreur est surevenue";
    } catch (e) {
      console.error(e.message);
    }
  }

  static async getAll() {
    try {
      const tags = await ORM.getInstance().select("Tag");
      return tags;
    } catch (e) {
      console.error(e.message);
    }
  }

  static async getCommonTags() {
    try {
      const commonTags = await ORM.getInstance().query('SELECT DISTINCT tag_name from "Tag" NATURAL JOIN "Usertag"');
      return (commonTags.rows);
    } catch (e) {
      console.error(e.message);
    }
  }

  static async getTagByName(tag_name) {
    try {
      const tag = await ORM.getInstance().select("Tag", { 'tag_name' : tag_name });
      const tag_id = tag.rows[0].tag_id
      return tag_id;
    } catch (e) {
      console.error(e.message);
    }
  }

}
