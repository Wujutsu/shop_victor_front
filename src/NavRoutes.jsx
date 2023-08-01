import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { UserContext } from "./contexts/UserContext";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Account from "./pages/account/Account";

export const NavRoutes = () => {
  const { isLogged } = useContext(UserContext);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/account" element={isLogged ? <Account /> : <Login />} />
    </Routes>
  );
};

export default NavRoutes;
