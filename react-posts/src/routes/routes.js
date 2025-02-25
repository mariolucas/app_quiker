import React from "react";
import { Routes, Route, useLocation  } from "react-router-dom";
import Register from "../views/Register";
import Login from "../views/Login";
import Posts from "../views/Posts";
import PrivateRoute from "./PrivateRoute";
import Redirect from "../views/Redirect";
import MenuBar from "../components/MenuBar";
import PostDetalhe from "../views/PostDetalhe.js";
import Profile from "../views/Profile.js";
import Report from "../views/Report";


const AppRoutes = () => {

  // Verifica se a rota não é "/login" ou "/register"
  const currentLocation = useLocation();
  const shouldShowMenu = currentLocation.pathname !== "/login" && currentLocation.pathname !== "/register";

  return (
    <>
      {shouldShowMenu && <MenuBar />}
      <Routes>
        <Route path="/" element={<Redirect />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/posts" element={<PrivateRoute><Posts /></PrivateRoute>} />
        <Route path="/post/:post_id" element={<PrivateRoute><PostDetalhe /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/report" element={<PrivateRoute><Report /></PrivateRoute>} />
      </Routes>
    </>
  );
};

export default AppRoutes;