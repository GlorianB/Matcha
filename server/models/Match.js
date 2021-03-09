const ORM = require('../core/ORM');

const User = require('./User');
const Usertag = require('./Usertag');
const Like = require('./Like');
const Blocked = require('./Blocked');

const { compareUsers } = require('../utils/compareUsers');

module.exports = class Match {

  static async getMatchingUsers(user_id, search) {
    try {
      let user = await ORM.getInstance().select("User", { user_id });
      user = user.rows[0];
      const user_genre = user.user_genre;
      const user_orientation = user.user_orientation;

      // 1. On recupere les profiles selon la preference sexuelle de l'utilisateur
        // On veut  : id, login, image, image1, image2, image3, image4, firstname, lastname, score
        // valuesArray : [ login, genre1, orientation1, genre2, orientation2, (genre3, orientation3, genre4, orientation4) ]

      let values = [];
      const user_login = user.user_login;


      let genre_orientation = [];
      user_genre === 'homme' && user_orientation === 'hetero' ? genre_orientation.push(['femme', 'hetero']) && genre_orientation.push(['femme', 'bi']) : 0;
      user_genre === 'femme' && user_orientation === 'hetero' ? genre_orientation.push(['homme', 'hetero']) && genre_orientation.push(['homme', 'bi']) : 0;

      user_genre === 'homme' && user_orientation === 'gay' ? genre_orientation.push(['homme', 'gay']) && genre_orientation.push(['homme', 'bi']) : 0;
      user_genre === 'femme' && user_orientation === 'gay' ? genre_orientation.push(['femme', 'gay']) && genre_orientation.push(['femme', 'bi']) : 0;

      user_genre === 'homme' && user_orientation === 'bi' ?
        genre_orientation.push(['femme', 'bi'])
        && genre_orientation.push(['femme', 'hetero'])
        && genre_orientation.push(['homme', 'gay'])
        && genre_orientation.push(['homme', 'bi']) : 0;

      user_genre === 'femme' && user_orientation === 'bi' ?
        genre_orientation.push(['femme', 'bi'])
        && genre_orientation.push(['femme', 'homo'])
        && genre_orientation.push(['homme', 'bi'])
        && genre_orientation.push(['homme', 'hetero']) : 0;

      values.push(user_login);
      for (const genreOri of genre_orientation)
        values = values.concat(genreOri);
      // 2. On recupere la distance
        // Distance, d = 3963.0 * arccos[(sin(lat1) * sin(lat2)) + cos(lat1) * cos(lat2) * cos(long2 – long1)]
        // acos(least(greatest(...),-1),1)) car acos[-1, 1]. Erreur en cas de depassement

      let distanceQuery = `3963 * ACOS( least(greatest((SIN(${user.user_latitude}) * SIN(user_latitude)) + (COS(${user.user_latitude}) * COS(user_latitude) * COS(${user.user_longitude} - user_longitude)), -1), 1))`;

      let cpt = 6;

      let query = `SELECT user_id, user_login, user_image, user_image1, user_image2, user_image3, user_image4, user_firstname, user_lastname, user_age, user_score, ${distanceQuery} AS "distance" FROM "User"
        WHERE user_login != $1 AND ((user_genre = $2 AND user_orientation = $3) OR (user_genre = $4 AND user_orientation = $5)`;

      if (values.length > 5) {
        query += ' OR (user_genre = $6 AND user_orientation = $7) OR (user_genre = $8 AND user_orientation = $9)';
        cpt = 10;
      }
      query += `)`;

      // Application des données de la recherche avancée
      if (search.applySearch) {
        if (search.age[0] && search.age[1]) {
          query += ` AND user_age >= $${cpt} AND user_age <= $${cpt + 1}`;
          values = values.concat([search.age[0], search.age[1]]);
          cpt = cpt + 2;
        }
        if (search.localisation[0] && search.localisation[1]) {
          query += ` AND ${distanceQuery} >= $${cpt} AND ${distanceQuery} <= $${cpt + 1}`;
          values = values.concat([search.localisation[0], search.localisation[1]]);
          cpt = cpt + 2;
        }
        if (search.score[0] && search.score[1]) {
          query += ` AND user_score >= $${cpt} AND user_score <= $${cpt + 1}`;
          values = values.concat([search.score[0], search.score[1]]);
          cpt = cpt + 2;
        }
      }

      query += ' ORDER BY distance';

      const result = await ORM.getInstance().query(query, values);

      let newResult = [];

      //check likes and blocked usr
      for (const usr of result.rows) {
        const checkLike = await Like.getLike(user_id, usr.user_id);
        const checkBlocked = await Blocked.getBlocked(user_id, usr.user_id);
        if (!checkLike.rows.length && !checkBlocked.rows.length)
          newResult.push(usr);
      }


      // 3. On recupere le nombre de tags en communs ou les tags selectionnes
      const selectedTags = search.applySearch ? search.selectedTags : [];
      let users = await Match.readCommonTags(user.user_id, newResult, selectedTags);


      // 4. On applique des ratios
        // Distance = 1000; Tags = 100; Score = 10;
      let usersTable = [];
      for (const user of users) {
        const ratio = user.distance * 1000 + user.commonTags * 100 - parseInt(user.user_score) * 10 ;
        usersTable.push({ 'login' : user.user_login, 'firstname' : user.user_firstname, 'lastname' : user.user_lastname, 'score' : parseInt(user.user_score), 'image' : user.user_image, 'image1' : user.user_image1, 'image2' : user.user_image2, 'image3' : user.user_image3, 'image4' : user.user_image4, 'age' : user.user_age, 'localisation' : user.distance, 'commonTags' : user.commonTags, ratio });
      }

      const finalTable = usersTable.slice().sort(compareUsers);
      return finalTable;
    } catch (e) {
      console.error('Matching foireux1: ' +  e);
    }
  }

  static async readCommonTags(user_id, users_array, selectedTags = []) {
    try {
      // 1. On parcourt la liste d'utilisateur et on remplit une nouvelle liste avec une propriete indiquant le nombre de tags en communs
      let new_array = [];
      for (const user of users_array) {
        let commonTags = 0;
        if (!selectedTags.length)
          commonTags = await Usertag.getCommonTags(user_id, user.user_id);
        else
          commonTags = await Usertag.getCommonTagsByNames(user.user_id, selectedTags);
        new_array.push({ ...user, commonTags });
      }
      return new_array
    } catch (e) {
      console.error('Lecture des tags en communs foireux: ' + e);
    }
  }
};
