import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'

const logout = async (setAuth) => {
  try {
    const response = await axios.get('http://localhost:8000/logout', {
      mode: 'cors',
      headers: {
        "jwt" : localStorage.jwt
      }
    });
    localStorage.removeItem("jwt");
    setAuth(false);
    toast.success(response.data);
  } catch (e) {
    console.error(e.message);
    toast.error("erreur lors de la deconnexion");
  }
};

export default logout;
