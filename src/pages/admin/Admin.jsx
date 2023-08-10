import React from "react";
import "./Admin.scss";
import GestionCategorie from "./gestionCategorie/GestionCategorie";

const Admin = () => {
  return (
    <div className="admin">
      <button className="btn btn-success">Catégories</button>
      <button className="btn btn-outline-success m-2">Produits</button>
      <button className="btn btn-outline-success">Commandes</button>
      <GestionCategorie />
    </div>
  );
};

export default Admin;
