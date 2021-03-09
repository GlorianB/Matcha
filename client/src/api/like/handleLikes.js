export const getLikes = async () => {
  const response = await fetch(`http://localhost:8000/like/getAllLikes`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      "jwt" : localStorage.jwt
    }
  });

  return response;
};

export const checkLike = async (liked_login) => {
  const response = await fetch(`http://localhost:8000/like/check/${liked_login}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      "jwt" : localStorage.jwt
    }
  });

  return response;
};

export const checkAlreadyLike = async (liker_login) => {
  const response = await fetch(`http://localhost:8000/like/${liker_login}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      "jwt" : localStorage.jwt
    }
  });

  return response;
};

export const postLike = async (liked_login) => {
  const response = await fetch(`http://localhost:8000/like/addLike/${liked_login}`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      "Content-Type" : "application/json",
      "jwt" : localStorage.jwt
    },
  });

  return response;
};

export const deleteLike = async (liked_login) => {
  const response = await fetch(`http://localhost:8000/like/delete/${liked_login}`, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      "Content-Type" : "application/json",
      "jwt" : localStorage.jwt
    },
  });

  return response;
};
