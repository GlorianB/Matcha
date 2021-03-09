import React, { Fragment, useState } from 'react';
import { withRouter } from "react-router";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import recover from '../../api/auth/recover';

toast.configure();

const RecoverComponent = (props) => {
  const [inputs, setInputs] = useState({
    password : '',
    confirmPassword : ''
  });

  const { password, confirmPassword } = inputs;

  const { user_login, user_ftoken } = props.match.params;

  const onChangeInput = (event) => {
    setInputs({ ...inputs, [event.target.name] : event.target.value });
  };

  const onSubmitForm = async (event) => {
    event.preventDefault();
    await recover(password, confirmPassword, user_login, user_ftoken);
  };

  return (
    <Fragment>
      <h1 className='text-center my-3 display-1'>Nouveau mot de passe</h1>
      <form className='my-5'>
        <input type='password'
          name='password'
          placeholder='password'
          className='form-control my-3'
          onChange={(e) => onChangeInput(e)}
          value={password}/>
        <input
          type='password'
          name='confirmPassword'
          placeholder='confirm your password'
          className='form-control my-3'
          onChange={(e) => onChangeInput(e)}
          value={confirmPassword}/>
        <button className='btn btn-success btn-block' onClick={(e) => onSubmitForm(e)}>Confirmer</button>
      </form>
    </Fragment>
  );
};

const Recover = withRouter(RecoverComponent);

export default Recover;
