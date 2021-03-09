const fs = require('fs');
const path = require('path');
const ORM = require('../core/ORM');
const createDir = require('../utils/createImageDir');
const bcrypt = require('bcrypt');
const generatejwt = require('../utils/generatejwt');
const mailer = require('../utils/sendmail');
const { uuid } = require('uuidv4');

require('dotenv').config();

module.exports = class User {

  static async getUser(user_id) {
    try {
      const user = await ORM.getInstance().select("User", { user_id });
      return user;
    } catch (e) {
      console.error(e.message);
    }
  }

  static async getUserByLogin(user_login) {
    try {
      const user = await ORM.getInstance().select("User", { user_login });
      return user;
    } catch (e) {
      console.error(e.message);
    }
  }

  static async login(login, password) {
    //1. check if user doesn't exists. if doesn't exists throw error
    let user = await ORM.getInstance().select("User", {'user_login' : login});
    if (user.rows.length < 1)
      return ("Login incorrect");
    user = user.rows[0];

    //2. check if user has activated account
    if (user.user_vtoken)
      return ("Le compte n'est pas encore activé");

    if (user.user_ftoken)
      return ("Le mot de passe a été réinitialisé, consultez vos mails");

    //3. compare password
    const hashedPassword = user.user_password
    const match = await bcrypt.compare(password, hashedPassword);
    if (!match)
      return ("Mot de passe incorrect");

    //4. Update user last login
    await ORM.getInstance().update("User", {'user_lastlogin' : null}, {'user_login' : user.user_login});

    //5. send token
    const jwt = generatejwt(user.user_id, user.user_login);
    return ({ jwt });
  }

  static async register(login, password, email, firstname, lastname) {
    //1. check if user exists. if exists throw error
    let user = await ORM.getInstance().select("User", {'user_login' : login});
    if (user.rows.length > 0) {
      return ({ error : "Ce login existe deja" });
    }
    user = await ORM.getInstance().select("User", {'user_email' : email});
    if (user.rows.length > 0)
      return ({ error : "Cet email existe deja" });

    //2. crypt user password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    //3. enter user and vtoken into our database
    const vtoken = uuid();
    const uniqueLink = `http://localhost:3000/validate/${login}/${vtoken}`;
    const newUser = await ORM.getInstance().insert("User",
      [login, hashedPassword, email, firstname, lastname, vtoken],
      ['user_login', 'user_password', 'user_email', 'user_firstname', 'user_lastname', 'user_vtoken']);
    if (!newUser)
      throw 'Db insert error';
    //4. sendmail
    let info = await mailer.transporter.sendMail({
      from: mailer.from, // sender address
      to: email, // list of receivers
      subject: mailer.signupSubject, // Subject line
      html: mailer.signupBody(login, uniqueLink), // html body
    });

    if (info.messageId)
      return ({ success : `Un email a été envoyé a ${email}` });
    else
      throw 'mailer error';
  }

  static async validate(login, vtoken) {
    let user = await ORM.getInstance().select("User", {'user_login' : login});
    // 1. Check if user exists
    if (!user.rows.length)
      return ("Ce compte n'existe pas");
    // 2. compare vtoken, if not match return error
    user = user.rows[0];
    if (!user.user_vtoken) {
      return ("Ce compte est deja activé");
    }
    if (!(user.user_vtoken === vtoken))
      return ("Ce lien est erroné, réessayez avec le bon lien");
    // 3. if match update vtoken to null => user is registered
    await ORM.getInstance().update("User", { 'user_vtoken' : null }, { 'user_login' : login });
    return "OK";
  }

  static async forgot(login, email) {
    let user = await ORM.getInstance().select("User", { 'user_login' : login, 'user_email' : email});
    if (!user.rows.length)
      return ("Ce compte n'existe pas");
    user = user.rows[0];
    if (user.user_ftoken) {
      return ("Vous avez deja recu un mail de reinitialisaion");
    }
    // sendMail
    const ftoken = uuid();
    const uniqueLink = "http://localhost:3000/recover/" + login + '/' + ftoken;
    let info = await mailer.transporter.sendMail({
    from: mailer.from, // sender address
    to: email, // list of receivers
    subject: mailer.forgotSubject, // Subject line
    html: mailer.forgotBody(login, uniqueLink), // html body
    });
    if (info.messageId) {
      await ORM.getInstance().update("User", { 'user_ftoken' : ftoken }, { 'user_login' : login });
      return ('OK');
    }
    else
      throw 'mailer error';
  }

  static async recover(login, password, ftoken) {
    let user = await ORM.getInstance().select("User", {'user_login' : login});
    if (!user.rows.length)
      return ("Ce compte n'existe pas");
    user = user.rows[0];
    if (!user.user_ftoken)
      return ("Le mot de passe est déja set");
    if (!(user.user_ftoken === ftoken))
      return ("Ce lien est erroné, réessayez avec le bon lien");
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    await ORM.getInstance().update("User", { 'user_ftoken' : null, 'user_password' : hashedPassword }, { 'user_login' : login });
    return "OK";
  }


  static async logout(user_id) {
    let user = await ORM.getInstance().query(`UPDATE "User" SET user_lastlogin = CURRENT_TIMESTAMP WHERE user_id = $1 RETURNING *`, [user_id]);
    // let user = await ORM.getInstance().update("User", { 'user_lastlogin' : Date.now() }, { 'user_id' : user_id });
    if (user)
      return "OK";
    return "Probleme lors de la deconnexion";
  }

  static async update(user_id, body) {
    let user = await ORM.getInstance().select("User", { 'user_id' : user_id });
    if (user.rows.length < 1)
      return "Utilisateur introuvable";

    const old_login = user.rows[0].user_login;
    const path = `${process.cwd()}/image/`;

    user = await ORM.getInstance().select("User", { 'user_login' : body.login });
    if (user.rows.length && user.rows[0].user_id !== user_id)
      return "Ce login existe deja";
    // update du profile
    user = await ORM.getInstance().update("User", {'user_genre' : body.genre,
          'user_orientation' : body.orientation,
          'user_bio' : body.bio,
          'user_login' : body.login,
          'user_firstname' : body.firstname,
          'user_lastname' : body.lastname,
          'user_email' : body.email,
          'user_age' : body.age,
          'user_locpreference' : body.locpreference
          },
          {'user_id' : user_id});
      if (user) {
        const path = `${process.cwd()}/image/`;
        const old_path = path + old_login;
        const new_path = path + body.login;
        if (new_path !== old_path) {
          const frontImagePath = `http://localhost:${process.env.PORT}/image/${body.login}/photoProfile`;

          const image = await ORM.getInstance().update("User", { user_image : frontImagePath }, { user_id });

          if (!image)
            return "Probleme lors lors de l'insertion de l'image dans la database";
          fs.renameSync(old_path, new_path);
        }
        return "OK";
      }
      return "Erreur lors du chargement de la mise a jour du profile";
  }

  static async updatePassword(user_id, body) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    let user = await ORM.getInstance().update("User", {'user_password' : hashedPassword}, {'user_id' : user_id});
    if (user)
      return "OK";
    return "Erreur";
  }

  static async addProfileImage(user_id, profileImage) {
    try {
      const user = await User.getUser(user_id);
      const user_login = user.rows[0].user_login;

      const image_extension = path.extname(profileImage.name)

      const imagePath = `${process.cwd()}/image/${user_login}/photoProfile`;
      const frontImagePath = `http://localhost:${process.env.PORT}/image/${user_login}/photoProfile`;
      profileImage.mv(imagePath);

      const image = await ORM.getInstance().update("User", { user_image : frontImagePath }, { user_id });
      if (!image)
        throw "Probleme lors lors de l'insertion de l'image dans la database";

      return "OK";

    } catch (e) {
      console.error(e.message);
      return "Erreur lors du chargement de l'image";
    }
  }

  static async addSecondaryImage(user_id, secondaryImage, numeroImage) {
    try {
      const user = await User.getUser(user_id);
      const user_login = user.rows[0].user_login;

      const image_extension = path.extname(secondaryImage.name)

      const imagePath = `${process.cwd()}/image/${user_login}/photo${numeroImage}`;
      const frontImagePath = `http://localhost:${process.env.PORT}/image/${user_login}/photo/${numeroImage}`;
      secondaryImage.mv(imagePath);

      const image = await ORM.getInstance().update("User", { ['user_image' + numeroImage] : frontImagePath }, { user_id });
      if (!image)
         throw "Probleme lors lors de l'insertion de l'image dans la database";

      return "OK";
    } catch (e) {
      console.error(e.message);
      return "Erreur lors du chargement de l'image";
    }
  }

  static async updatePosition(user_id, position) {
    try {
      const user = await ORM.getInstance().update("User", { 'user_latitude' : position.latitude, 'user_longitude' : position.longitude }, { user_id });
      if (!user)
        throw "Erreur lors de la mise a jour de la position";
      return "OK";
    } catch (e) {
      console.error(e.message);
      return "Erreur lors de la mise a jour de la position";
    }
  }

  static async updateScore(user_id, newScore) {
    try {
      const user = await ORM.getInstance().update("User", {'user_score' : newScore}, {user_id});
      if (!user)
        throw "Erreur lors de la mise a jour du score";
      return "OK";
    } catch (e) {
      console.error(e);
    }
  }
}
