import React, { useEffect, useState } from "react";
import ReportService from "../services/ReportService";

const Report = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await ReportService.getReport();
        setReportData(data);
      } catch (error) {
        setError("Erro ao carregar relatório.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Relatório de Posts</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Título</th>
                <th>Comentários</th>
                <th>Likes</th>
                <th>Unlike</th>
                <th><small>unicos</small> <br /> Views </th>
              </tr>
            </thead>
            <tbody>
              {reportData.length > 0 ? (
                reportData.map((post, index) => (
                  <tr key={index}>
                    <td>{post.title}</td>
                    <td>{post.total_comments}</td>
                    <td>{post.total_likes}</td>
                    <td>{post.total_unlikes}</td>
                    <td>{post.total_views}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">Nenhum dado disponível</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Report;
