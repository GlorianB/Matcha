const escapeHtml = (unsafe) => {
  return unsafe
     .replace(/&/g, "&amp;")
     .replace(/</g, "&lt;")
     .replace(/>/g, "&gt;")
     .replace(/"/g, "&quot;")
     .replace(/'/g, "&#039;");
};

const checkEmail = (userEmail) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
};

const checkPassword = (userPassword) => {
  return /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(userPassword);
}; // 8 caracteres minimum, une majuscule, une minuscule, un nombre ou caractere special

const checkLogin = (userLogin) => {
  if (userLogin === 'self')
    return false;
  return /^[0-9a-zA-Z&#($_);.+!-]{1,}$/.test(userLogin);
};

exports.registerValidator = (req, res, next) => {
  let { login, password, email, firstname, lastname } = req.body;

  login = login.trim();
  firstname = firstname.trim();
  lastname = lastname.trim();

  if (![email, login, password, email, firstname, lastname].every(Boolean)) { // undefined ou null
    return res.status(401).json("Tous les champs sont requis");
  } else if (!checkEmail(email)) { // email invalide
    return res.status(401).json("Email invalide");
  } else if (!checkPassword(password)) { //password invalide
    return res.status(401).json("Le mot de passe doit faire 8 caracteres de long minimum et contenir au moins 1 majuscule, 1 minuscule, ainsi qu'un nombre ou caractere special");
  } else if (!checkLogin(login)) { // login invalide
    return res.status(401).json("Le pseudo n'est pas valide");
  }

  login = escapeHtml(login);
  password = escapeHtml(password);
  email = escapeHtml(email);
  firstname = escapeHtml(firstname);
  lastname = escapeHtml(lastname);
  if (
    login.length > 40 ||
    password.length > 255 ||
    email.length > 255 ||
    firstname.length > 255 ||
    lastname.length > 255
  )
    return res.status(401).json("Un champ a trop de caracteres !");
  if (login.length < 3)
    return res.status(401).json("Le login est trop court");
  next();
};

exports.loginValidator = (req, res, next) => {
  const { login, password } = req.body;
  if (![login, password].every(Boolean)) {
    return res.status(401).json("Tous les champs sont requis");
  }
  next();
};

exports.forgotValidator = (req, res, next) => {
  const { login, email } = req.body;
  if (![login, email].every(Boolean)) {
    return res.status(401).json("Tous les champs sont requis");
  } else if (!checkEmail(email)) { // email invalide
    return res.status(401).json("Email invalide");
  }
  next();
};

exports.recoverValidator = (req, res, next) => {
  const { password, confirmPassword } = req.body;
  if (![password, confirmPassword].every(Boolean)) {
    return res.status(401).json("Tous les champs sont requis");
  } else if (!checkPassword(password)) {
      return res.status(401).json("Le mot de passe doit faire 8 caracteres de long minimum et contenir au moins 1 majuscule, 1 minuscule, ainsi qu'un nombre ou caractere special");
  } else if (!(password === confirmPassword))
    return res.status(401).json("Les mot de passes ne matchent pas");
  next();
};

exports.profileValidator = (req, res, next) => {
  let { login, firstname, lastname, email, age, genre, orientation, bio, locpreference, tagList} = req.body;

  login = login.trim();
  firstname = firstname.trim();
  lastname = lastname.trim();
  bio = bio.trim();

  if (![login, firstname, lastname, email, age, genre, orientation, bio].every(Boolean)) {
    return res.status(401).json("Tous les champs sont requis");
  } else if (!checkEmail(email)) { // email invalide
    return res.status(401).json("Email invalide");
  } else if (!checkLogin(login)) { // login invalide
    return res.status(401).json("Le pseudo n'est pas valide");
  } else if (!tagList.length) {
    return res.status(401).json("Tu n'as pas choisi de tags");
  }

  //check length
  login = escapeHtml(login);
  email = escapeHtml(email);
  firstname = escapeHtml(firstname);
  lastname = escapeHtml(lastname);
  bio = escapeHtml(bio);
  if (
    login.length > 40 ||
    email.length > 255 ||
    firstname.length > 255 ||
    lastname.length > 255 ||
    bio.length > 1000
  )
    return res.status(401).json("Un champ a trop de caracteres !");

  if (login.length < 3)
    return res.status(401).json("Le login est trop court");

  if (isNaN(age))
    return res.status(401).json("age invalide");

  if (genre === '' || (genre !== 'homme' && genre !== 'femme' && genre !== 'bigenre'))
    return res.status(401).json("genre invalide");

  if (orientation === '' || (orientation !== 'hetero' && orientation !== 'bi' && orientation !== 'gay'))
    return res.status(401).json("orientation invalide");
  next();
};

exports.passwordValidator = (req, res, next) => {
  const { password, confirmPassword } = req.body;
  if (![password, confirmPassword].every(Boolean)) {
    return res.status(401).json("Tous les champs sont requis");
  } else if (!checkPassword(password)) {
      return res.status(401).json("Le mot de passe doit faire 8 caracteres de long minimum et contenir au moins 1 majuscule, 1 minuscule, ainsi qu'un nombre ou caractere special");
  } else if (!(password === confirmPassword))
    return res.status(401).json("Les mot de passes ne matchent pas");
  next();
};
