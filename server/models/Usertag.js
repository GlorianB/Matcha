const ORM = require('../core/ORM');

const Tag = require('./Tags');

const { getCommonObjects } = require('../utils/getCommonObjects');

module.exports = class Usertag {

  static async getTags(user_id, tag_id) {
    try {
      const usertag = await ORM.getInstance().select("Usertag", {user_id, tag_id})
      let tags = []
      if (usertag.rows.length > 0) {
        for (const user_tag of usertag.rows) {
          const tag = await ORM.getInstance().select("Tag", { tag_id : user_tag.tag_id });
          tags.push(tag.rows[0]);
        }
      }
      return tags;
    } catch (e) {
      console.error(e.message);
      return res.status(500).send("Server error");
    }
  }


  static async getTagsByUserId(user_id) {
    try {
      const usertag = await ORM.getInstance().select("Usertag", {user_id})
      let tags = []
      if (usertag.rows.length > 0) {
        for (const user_tag of usertag.rows) {
          const tag = await ORM.getInstance().select("Tag", { tag_id : user_tag.tag_id });
          tags.push(tag.rows[0]);
        }
        return tags;
      }
      else
        throw "Utilisateur non trouvé lors de la recuperation de tags";
    } catch (e) {
      // console.error(e);
    }
  }

  static async getTagsByUserLogin(user_login) {
    try {
      const usertag = await ORM.getInstance().query('SELECT * FROM "Usertag" natural join "User" where user_login = $1', [user_login]);
      let tags = []
      if (usertag.rows.length > 0) {
        for (const user_tag of usertag.rows) {
          const tag = await ORM.getInstance().select("Tag", { tag_id : user_tag.tag_id });
          tags.push(tag.rows[0]);
        }
        return tags;
      }
      else
        throw "Utilisateur non trouvé lors de la recuperation de tags";
    } catch (e) {
      // console.error(e);
    }
  }

  static async getCommonTags(user1_id, user2_id) {
    try {
      const user1_tags = await Usertag.getTagsByUserId(user1_id);
      const user2_tags = await Usertag.getTagsByUserId(user2_id);
      let commonTagsNumber = 0;
      if (user2_tags)
        commonTagsNumber = getCommonObjects(user1_tags, user2_tags);
      return commonTagsNumber;
    } catch (e) {
      console.error(e);
    }
  }

  static async getCommonTagsByNames(user_id, tag_list) {
    try {
      let tags = [];
      let commonTagsNumber = 0;
      for (const tag_elem of tag_list) {
        const tag_name = tag_elem.value;
        const tag = await Tag.getTagByName(tag_name);
        tags.push({ tag_id : tag,  tag_name});
      }
      const usertag = await Usertag.getTagsByUserId(user_id);
      if (usertag)
        commonTagsNumber = getCommonObjects(tags, usertag);
      return commonTagsNumber;
    } catch (e) {
    console.error(e);
    }
  }

  static async getTagsByTagId(tag_id) {
    try {
      const usertag = await ORM.getInstance().select("Usertag", {tag_id})
      let tags = []
      if (usertag.rows.length > 0) {
        for (const user_tag of usertag.rows) {
          const tag = await ORM.getInstance().select("Tag", { tag_id : user_tag.tag_id });
          tags.push(tag.rows[0]);
        }
      }
        return tags;
    } catch (e) {
      console.error(e.message);
      return res.status(500).send("Server error");
    }
  }

  static async addUserTags(user_id, tags) {
    try {
      var tagList = [];
      for (const tag of tags) {
        let t = await ORM.getInstance().select("Tag", {'tag_name' : tag.value})
        if (!t)
          throw "Erreur lors de l'ajout de tag";
        tagList.push(t.rows[0].tag_id.toString());
      }
      for (const tag of tagList) {
        let t2 = await ORM.getInstance().select("Usertag", {'user_id' : user_id, 'tag_id' : tag})
        if (t2.rows.length < 1) {
          let result = await ORM.getInstance().insert("Usertag", [user_id, tag], ['user_id', 'tag_id']);
          if (!result)
            throw `Erreur lors de l'ajout du tag ${tag} a l'utilisateur ${user_id}`;
        }
      }
      return "OK";
      // for (const tag of tags) {
      //   const usertag = await ORM.getInstance().insert("Usertag", [user_id])
      // }
    } catch (e) {
      console.error(e);
    }
  }

  static async delete(user_id, tag_name) {
    try {
      const tag = await ORM.getInstance().select("Tag", { 'tag_name' : tag_name });
      const tag_id = tag.rows[0].tag_id
      const deletedTag = await ORM.getInstance().delete("Usertag", { 'tag_id' : tag_id });
      if (deletedTag)
        return "OK"
      else
        throw "Erreur lors de la suppression";
    } catch (e) {
      console.error(e);
    }
  }

}
