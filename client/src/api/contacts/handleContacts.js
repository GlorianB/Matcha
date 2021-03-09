export const checkContact = async (contact2_login) => {
  const response = await fetch(`http://localhost:8000/contacts/check/${contact2_login}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      "jwt" : localStorage.jwt
    }
  });

  return response;
};

export const fetchContacts = async () => {
  const response = await fetch(`http://localhost:8000/contacts/getcontacts`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      "jwt" : localStorage.jwt
    }
  });

  return response;
};
