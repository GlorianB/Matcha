export const fetchMessages = async (currentUser) => {
  const response = await fetch(`http://localhost:8000/message/getMessages/${currentUser}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      "jwt" : localStorage.jwt
    }
  });

  return response;
};

export const sendMessage = async (receiver_login, message__content) => {
  const body = { receiver_login, message__content };
  const response = await fetch(`http://localhost:8000/message/send`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Accept' : 'application/json',
      'Content-Type' : 'application/json',
      "jwt" : localStorage.jwt
    },
    body : JSON.stringify(body)
  });

  return response;
};
