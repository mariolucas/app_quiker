import api from "./api";
import { jwtDecode } from 'jwt-decode';

// Registrar usuário
export const register = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Erro ao registrar." };
  }
};

// Login do usuário
export const login = async (credentials) => {

  try {
    const response = await api.post('/login', credentials);
    
    if (response.data.success) {
      localStorage.setItem("token", response.data.user.token); // Salva o token
      localStorage.setItem("userId", response.data.user.id); // Salva o id do usuário
    }

    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Erro ao fazer login." };
  }
};

// Verifica se o usuário está logado
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; 

    if (decodedToken.exp < currentTime) {
      logout();
      return false; 
    }
    return true; 
  } catch (error) {
    logout();
    return false;
  }
};

// Logout do usuário
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
};
