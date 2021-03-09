import React, { Fragment } from 'react';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { Get } from 'react-axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


toast.configure();

const ValidateComponent = (props) => {
  const { user_login, user_vtoken } = props.match.params;

  return (
    <Fragment>
      <Get url={`http://localhost:8000/validate/${user_login}/${user_vtoken}`}>
        {(error, response, isLoading, makeRequest, axios) => {
          if(error) {
            return (<Redirect to={{ pathname: '/login', state: { toast_register_failure : response.data}}}/>);
          }
          else if (response) {
            return (<Redirect to={{ pathname: '/login', state: { toast_register_success : response.data }}}/>);
          }
          else
            return (<div>Error</div>);
        }}
      </Get>
    </Fragment>
  );
};

const Validate = withRouter(ValidateComponent);

export default Validate;
