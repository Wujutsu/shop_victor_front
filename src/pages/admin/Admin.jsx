import React, { useEffect, useState } from "react";
import "./Admin.scss";
import GestionProduct from "./gestionProduct/GestionProduct";
import GestionOrder from "./gestionOrder/GestionOrder";
import { NavLink, useLocation } from "react-router-dom";
import GestionFabric from "./gestionFabric/GestionFabric";

const Admin = () => {
  const location = useLocation();
  const [navigationAdmin, setNavigationAdmin] = useState("");

  useEffect(() => {
    setNavigationAdmin(location.pathname);
  }, [location.pathname]);

  return (
    <div className="admin">
      <NavLink to="/admin">
        <button
          className={`btn ${
            navigationAdmin === "/admin"
              ? "btn btn-success"
              : "btn btn-outline-success"
          }`}
        >
          Produits
        </button>
      </NavLink>
      <NavLink to="/admin/fabric">
        <button
          className={`btn m-2 ${
            navigationAdmin === "/admin/fabric"
              ? "btn btn-success"
              : "btn btn-outline-success"
          }`}
        >
          Tissus
        </button>
      </NavLink>
      <NavLink to="/admin/order">
        <button
          className={`btn ${
            navigationAdmin === "/admin/order"
              ? "btn btn-success"
              : "btn btn-outline-success"
          }`}
        >
          Commandes
        </button>
      </NavLink>

      {navigationAdmin === "/admin" && <GestionProduct />}
      {navigationAdmin === "/admin/order" && <GestionOrder />}
      {navigationAdmin === "/admin/fabric" && <GestionFabric />}
    </div>
  );
};

export default Admin;
