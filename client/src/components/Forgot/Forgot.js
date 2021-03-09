import React, { Fragment, useState } from 'react';
import { withRouter } from 'react-router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import forgot from '../../api/auth/forgot';

toast.configure();

const ForgotComponent = (props) => {
  const [inputs, setInputs] = useState({
    login : '',
    email : ''
  });

  const { login, email } = inputs;

  const onChangeInput = (event) => {
    setInputs({ ...inputs, [event.target.name] : event.target.value });
  };

  const onSubmitForm = async (event) => {
    event.preventDefault();
    await forgot(login, email);
  };

  return (
    <Fragment>
      <h1 className='text-center my-3 display-1'>Récupération mot de passe</h1>
      <form className='my-5'>
        <input type='text'
          name='login'
          placeholder='login'
          className='form-control my-3'
          onChange={(e) => onChangeInput(e)}
          value={login}/>
        <input
          type='email'
          name='email'
          placeholder='email'
          className='form-control my-3'
          onChange={(e) => onChangeInput(e)}
          value={email}/>
        <button className='btn btn-success btn-block' onClick={(e) => onSubmitForm(e)}>Récupération</button>
      </form>
    </Fragment>
  );
};

const Forgot = withRouter(ForgotComponent);

export default Forgot;
