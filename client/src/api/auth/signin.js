import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const signin = async (login, password, setAuth) => {
  const body = { login, password };
  try {
    const response = await fetch('http://localhost:8000/login', {
      method : 'POST',
      mode : 'cors',
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify(body)
    });

    const parseRes = await response.json();
    if (parseRes.jwt) {
      localStorage.setItem('jwt', parseRes.jwt);
      setAuth(true);
      toast.success("Welcome " + login + " !");
    } else {
      setAuth(false);
      toast.error(parseRes)
    }
  } catch (e) {
    console.error(e);
  }
};

export default signin;
