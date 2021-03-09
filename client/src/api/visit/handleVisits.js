export const postVisit = async (visited_login) => {
  const response = await fetch(`http://localhost:8000/visit/addVisit/${visited_login}`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      "Content-Type" : "application/json",
      "jwt" : localStorage.jwt
    },
  });

  return response;
};

export const checkVisit = async () => {
  const response = await fetch(`http://localhost:8000/visit/getVisits`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      "Content-Type" : "application/json",
      "jwt" : localStorage.jwt
    },
  });

  return response;
};
