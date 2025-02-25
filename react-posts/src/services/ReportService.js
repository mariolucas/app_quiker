import api from "./api";
const token = localStorage.getItem("token");

const ReportService = {
  getReport: async () => {
    try {
      const response = await api.get("/posts/report", {
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
        }
    });
      // console.log( response.data );
      return response.data.report;
    } catch (error) {
      console.error("Erro ao buscar relatório de posts:", error);
      throw error;
    }
  },
};

export default ReportService;