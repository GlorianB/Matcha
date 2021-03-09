export const getSelf = async () => {
  const response = await fetch("http://localhost:8000/user/self", {
    method: 'GET',
    mode: 'cors',
    headers: {
      "jwt" : localStorage.jwt
    }
  });

  return response;
};

export const getUserProfile = async (user_login) => {
  const response = await fetch(`http://localhost:8000/user/${user_login}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      "jwt" : localStorage.jwt
    }
  });

  return response;
}

export const postSelf = async (body) => {
  const response = await fetch('http://localhost:8000/user/self', {
    method : 'POST',
    mode : 'cors',
    headers : {
      'Content-Type' : 'application/json',
      'jwt' : localStorage.jwt
    },
    body : JSON.stringify(body)
  });

  return response;
}

export const updatePassword = async (body) => {
  const response = await fetch('http://localhost:8000/user/self/changePassword', {
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

export const updateUserPosition = async (lat_lng) => {
  try {
    const body = { latitude: lat_lng.latitude, longitude: lat_lng.longitude };
    const response = fetch('http://localhost:8000/user/postPosition', {
      method : 'PUT',
      mode : 'cors',
      headers : {
        'Content-Type' : 'application/json',
        'jwt' : localStorage.jwt
      },
      body : JSON.stringify(body)
    });

    return response;
  } catch (e) {
    console.error(e.message);
  }
};

export const fetchUserPos = async () => {
  try {
    const response = await fetch('https://freegeoip.app/json/');
    return response;
  } catch (e) {
    console.error(e.message);
  }
}
