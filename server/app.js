//Modules import
require('dotenv').config();
const http = require('http');
const express = require('express');
const chalk = require('chalk');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

//Custom modules import


//Routes import
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const tagRoutes = require('./routes/tags');
const imageRoutes = require('./routes/image');
const matchRoutes = require('./routes/match');
const likeRoutes = require('./routes/like');
const blockedRoutes = require('./routes/blocked');
const visitRoutes = require('./routes/visit');
const contactsRoutes = require('./routes/contacts');
const messageRoutes = require('./routes/message');


// Init express app
const app = express();


// App middlewares setup
app.use(morgan('dev'));
app.use(fileUpload({ createParentPath : true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));


// App routes definition
app.use('/', authRoutes);
app.use('/user', userRoutes);
app.use('/tags', tagRoutes);
app.use('/image', imageRoutes);
app.use('/match', matchRoutes);
app.use('/like', likeRoutes);
app.use('/block', blockedRoutes);
app.use('/visit', visitRoutes);
app.use('/contacts', contactsRoutes);
app.use('/message', messageRoutes);


//Error route
app.use('/', (req, res, next) => {
  return res.status(404).send('<h1>Page not found!</h1>')
});


//Init server via app instance
const port = process.env.PORT | 8000;
const server = http.createServer(app);

//Init socket
const io = require('socket.io');
const socketio = io.listen(server, {
  transports : ['websocket', 'xhr-polling']
});

//Launch server
server.listen(port, () => {
  console.log(`Server listening on port ${chalk.green(port)}`);
});


//Handle socket events
const clients = {};

socketio.on('connection', (socket) => {

  const data = socket.request;
  const login = data._query['login'];

  if (login !== ''){
    clients[login] = socket.id;
    console.log(socket.id);
  }

  socket.on('chat message', (user_login, sender_login) => {
    socketio.to(clients[user_login]).emit('new message', sender_login);
  });

  socket.on('like', (user_login, liker_login) => {
    socketio.to(clients[user_login]).emit('new like', liker_login);
  });

  socket.on('visit', (user_login, visiter_login) => {
    socketio.to(clients[user_login]).emit('new visit', visiter_login);
  });

  socket.on('unlike', (user_login, unliker_login) => {
    socketio.to(clients[user_login]).emit('new unlike', unliker_login);
  })
});
