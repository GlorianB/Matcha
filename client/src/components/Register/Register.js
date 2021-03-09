import React, { Fragment, useState } from 'react';
import { withRouter } from 'react-router';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import registration from '../../api/auth/registration';


toast.configure();

const RegisterComponent = (props) => {
  const [inputs, setInputs] = useState({
    login : '',
    password : '',
    email : '',
    firstname : '',
    lastname : ''
  });

  const { login, password, email, firstname, lastname } = inputs;

  const onChangeInput = (event) => {
    setInputs({ ...inputs, [event.target.name] : event.target.value });
  };

  const onSubmitForm = async (event) => {
    event.preventDefault();
    await registration(login, password, email, firstname, lastname);
  };

  return (
    <Fragment>
      <h1 className='text-center my-3 display-1'>Inscription</h1>
      <form className='my-5'>
        <input type='text'
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
        <input
          type='text'
          name='email'
          placeholder='email'
          className='form-control my-3'
          onChange={(e) => onChangeInput(e)}
          value={email}/>
        <input type='text'
          name='firstname'
          placeholder='firstname'
          className='form-control my-3'
          onChange={(e) => onChangeInput(e)}
          value={firstname}/>
        <input type='text'
          name='lastname'
          placeholder='lastname'
          className='form-control my-3'
          onChange={(e) => onChangeInput(e)}
          value={lastname}/>
        <button className='btn btn-success btn-block' onClick={(e) => onSubmitForm(e)}>S'inscrire</button>
      </form>
      <a href="/" className='btn btn-secondary text-center'>Deja un compte ?</a>
    </Fragment>
  );
};

const Register = withRouter(RegisterComponent);

export default Register;
