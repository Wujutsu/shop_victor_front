import React, { useEffect, useState } from "react";
import "./Admin.scss";
import GestionCategorie from "./gestionCategorie/GestionCategorie";
import GestionProduct from "./gestionProduct/GestionProduct";
import GestionOrder from "./gestionOrder/GestionOrder";
import { NavLink, useLocation } from "react-router-dom";

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
          className={`btn m-2 ${
            navigationAdmin === "/admin"
              ? "btn btn-success"
              : "btn btn-outline-success"
          }`}
        >
          Produits
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

      {navigationAdmin === "/admin" && (
        <div>
          <div>
            <GestionCategorie />
          </div>
          <div>
            <GestionProduct />
          </div>
        </div>
      )}
      {navigationAdmin === "/admin/order" && <GestionOrder />}
    </div>
  );
};

export default Admin;
