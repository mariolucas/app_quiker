import api from "./api";

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
      localStorage.setItem("userId", response.data.user.id); // Salva o token
    }

    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Erro ao fazer login." };
  }
};

// Verifica se o usuário está logado
export const isAuthenticated = () => {
  return !!localStorage.getItem("token"); // Retorna true se o token existir
};

// Logout do usuário
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
};
