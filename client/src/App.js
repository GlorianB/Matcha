import React, { Fragment, useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import './App.scss';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from 'react-loading-screen';
import io from "socket.io-client";


//font awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCoffee, faHeart, faTimesCircle, faFlag } from '@fortawesome/free-solid-svg-icons';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

//components
import CustomNavbar from './components/CustomNavbar/CustomNavbar';
import Profile from './components/Profile/Profile';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Validate from './components/Validate/Validate';
import Forgot from './components/Forgot/Forgot';
import Recover from './components/Recover/Recover';
import Match from './components/Match/Match';
import User from './components/User/User';
import Chat from './components/Chat/Chat';


///api
import checkAuth from './api/auth/checkAuth';


library.add(faCoffee, faHeart, faTimesCircle, faFlag);

toast.configure();

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  // eslint-disable-next-line
  const [isComplete, setIsComplete] = useState(false);
  const [login, setLogin] = useState('');

  const setAuth = (boolean) => {
    setAuthenticated(boolean);
  };

  const isAuth = async () => {
    const user_login = await checkAuth(setAuthenticated, setLoaded);
    setLogin(user_login);
  };

  useEffect(() => {
    isAuth();
  }, []);

  const socket = io('http://localhost:8000', {
    transports : ['websocket', 'xhr-polling'],
    query: `login=${login}`
  });

  socket.on('new like', (liker_login) => {
    toast.success(<><p>Vous avez reçu un nouveau like de </p><a href={`/user/${liker_login}`}>{liker_login}</a></>);
  });

  socket.on('new visit', () => {
    toast.success(<p>Vous avez reçu une nouvelle visite !</p>);
  });

  socket.on('new message', (sender_login) => {
    toast.success(<><p>Vous avez reçu un nouveau message ! </p></>);
  });

  socket.on('new unlike', (unliker_login) => {
    toast.success(<><a href={`/user/${unliker_login}`}>{unliker_login}</a><p>Ne vous like plus :( </p></>);

  });

  return (
    isLoaded ?
      <Fragment>
        <CustomNavbar setAuth={setAuth} isAuth={isAuthenticated} />
        <Container fluid>
          <Router>
            <Switch>
              <Route exact path='/login'
                render={(props) => !isAuthenticated ? <Login { ...props } setAuth={setAuth} socket={socket} /> : <Redirect to='/' />} />
              <Route exact path='/register'
                render={(props) => !isAuthenticated ? <Register { ...props } setAuth={setAuth} socket={socket} /> : <Redirect to='/' />} />
              <Route exact path='/'
                render={(props) => !isAuthenticated ? <Login { ...props } setAuth={setAuth} socket={socket} /> : <Redirect to='/profile' />} />
              <Route exact path='/validate/:user_login/:user_vtoken'
                render={(props) => !isAuthenticated ? <Validate { ...props } setAuth={setAuth} socket={socket} /> : <Redirect to='/' />} />
              <Route exact path='/forgot'
                render={(props) => !isAuthenticated ? <Forgot { ...props } setAuth={setAuth} socket={socket} /> : <Redirect to='/' />} />
              <Route exact path='/recover/:user_login/:user_ftoken'
                render={(props) => <Recover { ...props } setAuth={setAuth} socket={socket} />} />
              <Route exact path='/profile'
                render={(props) => isAuthenticated ? <Profile { ...props } setAuth={setAuth} socket={socket} /> : <Redirect to='/' />} />
              <Route exact path='/user/:param_login'
                render={(props) => isAuthenticated ? <User { ...props } setAuth={setAuth} socket={socket} login={login} /> : <Redirect to='/' />} />
              <Route exact path='/user/'
                  render={(props) => isAuthenticated ? <Redirect to='/user/self' socket={socket}/> : <Redirect to='/user/self' />} />
              <Route exact path='/match'
                render={(props) => isAuthenticated ? <Match { ...props } setAuth={setAuth} socket={socket} login={login} /> : <Redirect to='/' />} />
              <Route exact path='/chat'
                render={(props) => isAuthenticated ? <Chat { ...props } setAuth={setAuth} socket={socket} login={login} /> : <Redirect to='/' />} />
            </Switch>
          </Router>
        </Container>
      </Fragment>
    :
      <LoadingScreen loading={true} bgColor='#f1f1f1' spinnerColor='#9ee5f8' textColor='#676767' logoSrc='' text='Chargement...' children={'tamer'}/>
  );
}

export default App;
