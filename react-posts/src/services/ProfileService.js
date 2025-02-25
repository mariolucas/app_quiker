import api from "./api";
const token = localStorage.getItem("token");

const ProfileService = {
  getProfile: async () => {
    try {
      const response = await api.get("/profile", {
          headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
          }
      });
      return response.data.user;
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put("/profile", profileData, {
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
        }
    });
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      throw error;
    }
  },
};

export default ProfileService;
