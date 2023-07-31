import React from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "./views/home/Home";

export const NavRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};
