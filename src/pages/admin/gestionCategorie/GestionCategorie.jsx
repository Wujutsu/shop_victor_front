import React, { useContext, useEffect, useState } from "react";
import "./GestionCategorie.scss";
import { UserContext } from "../../../contexts/UserContext";
import axios from "axios";
import { AiOutlineDelete } from "react-icons/ai";
import ShowInfoPopup from "../../../components/showInfoPopup/ShowInfoPopup";

const GestionCategorie = () => {
  const { token } = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryError, setNewCategoryError] = useState(false);
  const [categoryUsedByProductError, setCategoryUsedByProductError] =
    useState(false);

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
    if (newCategory !== "") {
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
    } else {
      setNewCategoryError(true);
      setTimeout(() => {
        setNewCategoryError(false);
      }, 3000);
    }
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
        .catch((error) => {
          if (
            error.response.data ===
            "Cannot delete category. It is used by existing products."
          ) {
            setCategoryUsedByProductError(true);
            setTimeout(() => {
              setCategoryUsedByProductError(false);
            }, 3000);
          }
        });
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
      {newCategoryError && (
        <ShowInfoPopup
          msg="Impossible d'ajouter une catégorie vide"
          type="error"
        ></ShowInfoPopup>
      )}
      {categoryUsedByProductError && (
        <ShowInfoPopup
          msg="Impossible de supprimer une catégorie utilisée par des produits"
          type="error"
        ></ShowInfoPopup>
      )}
    </div>
  );
};

export default GestionCategorie;
