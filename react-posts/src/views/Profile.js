import React, { useEffect, useState } from "react";
import ProfileService from "../services/ProfileService";

const Profile = () => {
  const [profile, setProfile] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await ProfileService.getProfile();
        setProfile({ name: data.name, email: data.email, password: "" });
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await ProfileService.updateProfile(profile);
      setMessage("Perfil atualizado com sucesso!");
    } catch (error) {
      setMessage("Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Editar Perfil</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={profile.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={profile.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Senha (deixe em branco para não alterar)</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={profile.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Salvando..." : "Salvar Alterações"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
