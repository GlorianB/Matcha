const fetchMatch = async (body) => {
  const response = await fetch("http://localhost:8000/match", {
    method: 'POST',
    mode: 'cors',
    headers: {
      "Content-Type" : "application/json",
      "jwt" : localStorage.jwt
    },
    body : JSON.stringify(body)
  });

  return response;
};


export default fetchMatch;
