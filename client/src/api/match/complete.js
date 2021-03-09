export const checkCompleted  = async (setCompleted) => {
  const response = await fetch("http://localhost:8000/user/complete", {
    method: 'GET',
    mode: 'cors',
    headers: {
      "jwt" : localStorage.jwt
    }
  });

  const complete = await response.json();
  complete === 'OK' ? setCompleted(true) : setCompleted(false);
};

export default checkCompleted;
