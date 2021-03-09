import React, { Fragment, useState, useEffect } from 'react';
import { withRouter } from "react-router";
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import signin from '../../api/auth/signin';

toast.configure();

const LoginComponent = (props) => {
  const [inputs, setInputs] = useState({
    login : '',
    password : ''
  });

  const location = props.location;

  const history = useHistory();

  const { login, password } = inputs

  const setAuth = props.setAuth;

  const onChangeInput = (event) => {
    setInputs({ ...inputs, [event.target.name] : event.target.value });
  };

  const onSubmitForm = async (event) => {
    event.preventDefault();
    await signin(login, password, setAuth);
  };

  useEffect(() => {
    if (location.state){
      if (location.state.toast_register_success)
        toast.success(location.state.toast_register_success);
      else if (location.state.toast_register_failure)
        toast.error(location.state.toast_register_failure);
      history.push({
        pathname: '/',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <h1 className='text-center my-3 display-1'>Connexion</h1>
      <form className='my-5'>
        <input
          type='text'
          name='login'
          placeholder='login'
          className='form-control my-3'
          onChange={(e) => onChangeInput(e)}
          value={login}/>
        <input
          type='password'
          name='password'
          placeholder='password'
          className='form-control my-3'
          onChange={(e) => onChangeInput(e)}
          value={password}/>
        <button className='btn btn-success btn-block' onClick={(e) => onSubmitForm(e)}>Connexion</button>
        </form>
        <a href="/forgot" className='btn btn-danger text-center'>Mot de passe oublié</a>
    </Fragment>
  );
};

const Login = withRouter(LoginComponent);

export default Login;
