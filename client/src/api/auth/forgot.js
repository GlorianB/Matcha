import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const forgot = async (login, email) => {
  const body = { login, email };
  try {
    const response = await fetch('http://localhost:8000/forgot', {
      method : 'POST',
      mode : 'cors',
      headers : {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify(body)
    });

    const parseRes = await response.json();
    if (response.status === 200) {
      toast.success(parseRes);
      setTimeout(() => {
        window.location = '/';
      }, 5000);
    }
    else
      toast.error(parseRes);
  } catch (e) {
    console.error(e.message);
  }
};

export default forgot;
