import React from "react";
import { Link, useNavigate  } from 'react-router-dom';
import { logout } from '../services/authService';

const MenuBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container d-flex justify-content-center">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <Link className="navbar-brand" to="/posts">Posts</Link>
          <ul className="navbar-nav d-flex flex-row gap-3">
            <li className="nav-item">
              <Link className="nav-link" to="/posts">Posts</Link>
            </li>
            <li className="nav-item">
              <button className="btn btn-link nav-link" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default MenuBar;
