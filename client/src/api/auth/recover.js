import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const recover = async (password, confirmPassword, user_login, user_ftoken) => {
  const body = { password, confirmPassword };
  try {
    const response = await fetch(`http://localhost:8000/recover/${user_login}/${user_ftoken}`, {
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

export default recover;
