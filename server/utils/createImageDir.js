const fs = require('fs');

module.exports = (login) => {
  const imageDir = process.cwd() + '/image/';
  if (!fs.existsSync(imageDir))
    fs.mkdirSync(imageDir);
  const userDir = imageDir + login;
  if (!fs.existsSync(userDir))
    fs.mkdirSync(userDir);
}
