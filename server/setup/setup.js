const fs = require('fs');
const faker = require('faker');
const { Pool } = require('pg');

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const generate_orientation = () => {
  const orientation = ['hetero', 'gay', 'bi'];
  const index = getRandomInt(0, 3);
  if (!(index >= 0 && index <= 2))
    return generate_orientation();
  return orientation[index];
}
const generate_genre = () => {
  const genre = ['homme', 'femme'];
  const index = getRandomInt(0, 2);
  if (!(index >= 0 && index <= 1))
    return generate_genre();
  return genre[index];
}
const createUser = async () => {
  try {
    const User = {
      login: faker.internet.userName(),
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email(),
      password: `$2y$10$ExgTg5cP1nMWTbTv0iXnUOvBC1xQO54TrzJa87R3CnfQcztyRe3ne`, //Abcd1234*
      age: Math.floor(Math.random() * 82 + 18), //age between 18 and 100
      genre: generate_genre(),
      orientation: generate_orientation(),
      bio: faker.lorem.text(),
      score: Math.floor(Math.random() * 1000), // score between 0 and 1000
      locpreference: true,
      image: faker.image.avatar(),
      latitude: 48.8534,
      longitude: 2.3488
    };
    return (User);
  } catch (error) {
    console.error(error.message);
  }
};
try {
  const seed = process.argv[2];
  const pool = new Pool({
    host: 'XXXX',
    port: 0000,
    database: 'XXXX',
    user: 'XXXX',
    password: 'XXXX'
  });
  if (!(seed >= 500 && seed <= 1000))
    throw 'Seed to short or NaN';

    pool.query('INSERT INTO "User"(user_login, user_firstname, user_lastname, user_email, user_password, user_age, user_genre, user_orientation, user_bio, user_score, user_locpreference, user_image, user_latitude, user_longitude) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)', [
      'Glorian', 'Glorian', 'Bikoumou', 'gm.bikoumou@gmail.com', '$2y$10$ExgTg5cP1nMWTbTv0iXnUOvBC1xQO54TrzJa87R3CnfQcztyRe3ne',
      21, 'homme', 'hetero', 'salut', 999999999, true,
      'https://cdn.intra.42.fr/users/medium_gbikoumo.jpg', 48.8534, 2.3488
    ]).then((res) => {
      for (let i = 0; i < seed; i++) {
        const user = createUser().then(
          (user) => {
            pool.query('INSERT INTO "User"(user_login, user_firstname, user_lastname, user_email, user_password, user_age, user_genre, user_orientation, user_bio, user_score, user_locpreference, user_image, user_latitude, user_longitude) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)', [
              user.login, user.firstname, user.lastname, user.email, user.password,
              user.age, user.genre, user.orientation, user.bio, user.score, user.locpreference,
              user.image, user.latitude, user.longitude
            ]);

            const imageDir = '../image/';
            if (!fs.existsSync(imageDir))
              fs.mkdirSync(imageDir);
            const userDir = imageDir + user.login;
            if (!fs.existsSync(userDir))
              fs.mkdirSync(userDir);
          });
      }
    });
    if (!fs.existsSync('../image/'))
      fs.mkdirSync('../image/');
    if (!fs.existsSync('../image/Glorian'))
      fs.mkdirSync('../image/Glorian');
    pool.query('INSERT INTO "Tag"(tag_name) VALUES ($1)', ['Lecture']);
    pool.query('INSERT INTO "Tag"(tag_name) VALUES ($1)', ['Cinema']);
    pool.query('INSERT INTO "Tag"(tag_name) VALUES ($1)', ['Musique']);
} catch (error) {
    console.error("Error:", error);
}
