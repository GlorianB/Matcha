export const fetchTags = async () => {
  const response = await fetch('http://localhost:8000/tags/getTag', {
    method : 'GET',
    mode : 'cors',
    headers : {
      'Content-Type' : 'application/json',
      'jwt' : localStorage.jwt
    },
  });

  return response;
};

export const fetchUserTags = async () => {
  const response = await fetch('http://localhost:8000/tags/getUserTags', {
    method : 'GET',
    mode : 'cors',
    headers : {
      'Content-Type' : 'application/json',
      'jwt' : localStorage.jwt
    },
  });

  return response;
};

export const fetchTagsByLogin = async (param_login) => {
  const response = await fetch(`http://localhost:8000/tags/getUserTags/${param_login}`, {
    method : 'GET',
    mode : 'cors',
    headers : {
      'Content-Type' : 'application/json',
      'jwt' : localStorage.jwt
    },
  });

  return response;
};

export const deleteUsertag = async (login, body) => {
  const response = await fetch('http://localhost:8000/tags/deleteUserTag', {
    method : 'DELETE',
    mode : 'cors',
    headers : {
      'Content-Type' : 'application/json',
      'jwt' : localStorage.jwt,
      'login' : login
    },
    body : JSON.stringify(body)
  });

  return response;
};

export const addTag = async (body) => {
  const response = await fetch('http://localhost:8000/tags/addTag', {
    method : 'POST',
    mode : 'cors',
    headers : {
      'Content-Type' : 'application/json',
      'jwt' : localStorage.jwt
    },
    body : JSON.stringify(body)
  });

  return response;
};

export const getCommonTags = async () => {
  const response = await fetch('http://localhost:8000/tags/getTag', {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type' : 'application/json',
      'jwt' : localStorage.jwt
    }
  });

  return response;
};
