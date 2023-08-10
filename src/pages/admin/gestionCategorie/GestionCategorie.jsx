import React, { useContext, useEffect, useState } from "react";
import "./GestionCategorie.scss";
import { UserContext } from "../../../contexts/UserContext";
import axios from "axios";
import { AiOutlineDelete } from "react-icons/ai";

const GestionCategorie = () => {
  const { token } = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    const getAllCategories = () => {
      const apiUrl = "http://localhost:8080/api/categorie/all";
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      axios
        .get(apiUrl, config)
        .then((response) => {
          setCategories(response.data);
        })
        .catch((error) => {});
    };

    getAllCategories();
  }, [token]);

  const handleAddCategory = () => {
    const apiUrl = "http://localhost:8080/api/categorie/add";
    const requestData = {
      name: newCategory,
    };
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    axios
      .post(apiUrl, requestData, config)
      .then((response) => {
        const updateCategories = [...categories];
        updateCategories.push(response.data);
        setCategories(updateCategories);
        setNewCategory("");
      })
      .catch((error) => {});
  };

  const handleDeleteCategory = (id) => {
    const shouldDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer la catégorie ?"
    );
    if (!shouldDelete) {
      return; // Abort the deletion if the user cancels
    } else {
      const apiUrl = "http://localhost:8080/api/categorie/delete/" + id;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      axios
        .delete(apiUrl, config)
        .then((response) => {
          if (response.data) {
            const updatedCategories = categories.filter((cat) => cat.id !== id);
            setCategories(updatedCategories);
          }
        })
        .catch((error) => {});
    }
  };

  return (
    <div className="gestion-categorie">
      <h2>Gestion des Catégories</h2>
      <div className="categorie-form">
        <input
          type="text"
          placeholder="Nouvelle catégorie"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button
          className="btn btn-admin btn-primary"
          onClick={handleAddCategory}
        >
          Ajouter
        </button>
      </div>

      {categories.map((category, index) => (
        <div className="categorie-list" key={index}>
          <input type="text" value={category.name} disabled />
          <button
            className="btn btn-admin btn-danger"
            onClick={() => handleDeleteCategory(category.id)}
          >
            <AiOutlineDelete />
          </button>
        </div>
      ))}
    </div>
  );
};

export default GestionCategorie;
