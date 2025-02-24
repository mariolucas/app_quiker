import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Redirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Verifica se o usuário está logado

    if (token) {
      navigate("/posts"); // Se estiver logado, redireciona para /posts
    } else {
      navigate("/login"); // Se não estiver logado, redireciona para /login
    }
  }, [navigate]);

  return null; // Esse componente não renderiza nada, apenas redireciona
};

export default Redirect;
