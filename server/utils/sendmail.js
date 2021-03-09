require('dotenv').config();
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: process.env.MAILSERVICE,
  auth : {
    user: process.env.MAILUSER,
    pass: process.env.MAILPASS
  }
});

// const transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth : {
//     user: 'glorian.smtptest@gmail.com',
//     pass: 'smtptest'
//   }
// });

const from = 'glorian.smtptest@gmail.com';

const signupSubject = "Confirmation de ton compte Matcha";
const forgotSubject = "Réinitialisation de ton mot de passe";

const signupBody = (login, link) => {
  const body = `<h1> Bienvenu sur Matcha </h1><div><p>Salut ${login} ! Clique sur ce lien pour confirmer ton compte : <a href=${link}>validation</a><p></div>`
  return (body);
};

const forgotBody = (login, link) => {
  const body = `<h1> Nouveau mot de passe Matcha </h1><div><p>Salut ${login} ! Clique sur ce lien pour réinitialiser ton mot de passe : <a href=${link}>Reinitialisation</a><p></div>`
  return (body);
};

module.exports = {
  transporter,
  from,
  signupSubject,
  forgotSubject,
  signupBody,
  forgotBody
};
