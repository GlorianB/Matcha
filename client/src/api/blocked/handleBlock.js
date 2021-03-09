export const checkBlock = async (blocked_login) => {
  const response = await fetch(`http://localhost:8000/block/check/${blocked_login}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      "jwt" : localStorage.jwt
    }
  });

  return response;
};

export const postBlock = async (blocked_login) => {
  const response = await fetch(`http://localhost:8000/block/addBlock/${blocked_login}`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      "Content-Type" : "application/json",
      "jwt" : localStorage.jwt
    },
  });

  return response;
};

export const deleteBlock = async (blocked_login) => {
  const response = await fetch(`http://localhost:8000/block/delete/${blocked_login}`, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      "Content-Type" : "application/json",
      "jwt" : localStorage.jwt
    },
  });

  return response;
};
