import axios from 'axios';

const checkAuth = async (setAuthenticated, setLoaded) => {
  try {
    const response = await axios.get('http://localhost:8000/is_verify', {
      mode: 'cors',
      headers: {
        "jwt" : localStorage.jwt
      }
    });

    const auth = response.data;
    auth.auth === true ? setAuthenticated(true): setAuthenticated(false);

    return (auth.user_login ? auth.user_login : null);

  } catch (e) {
    console.error(e.message);
  } finally {
    setLoaded(true);
  }
};

export default checkAuth;
