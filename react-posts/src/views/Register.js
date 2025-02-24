import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await register(formData);

    if (response.success) {
      navigate("/login"); // Redireciona para login
    } else {
      setError(response.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-4 shadow rounded bg-white" style={{ width: "350px" }}>
        <h2 className="text-center mb-3">Registro</h2>
        {error && <p className="text-danger">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" className="form-control mb-3" placeholder="Nome" onChange={handleChange} required />
          <input type="email" name="email" className="form-control mb-3" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" className="form-control mb-3" placeholder="Senha" onChange={handleChange} required />
          <button type="submit" className="btn btn-primary w-100">Registrar</button>
        </form>
        <div className="text-center mt-3">
          <a href="/login">Já tem conta? Faça login</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
