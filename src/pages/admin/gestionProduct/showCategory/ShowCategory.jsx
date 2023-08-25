import React, { useContext, useState } from "react";
import "./ShowCategory.scss";
import { AiOutlineDelete } from "react-icons/ai";
import ShowInfoPopup from "../../../../components/showInfoPopup/ShowInfoPopup";
import { UserContext } from "../../../../contexts/UserContext";
import axios from "axios";

const ShowCategory = ({ categories, setCategories }) => {
  const { token } = useContext(UserContext);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryError, setNewCategoryError] = useState(0);
  const [categoryUsedByProductError, setCategoryUsedByProductError] =
    useState(false);

  //Ajouter une catégorie
  const handleAddCategory = () => {
    if (newCategory !== "") {
      //On vérifie que la catégorie n'existe pas déjà
      const verifDoublou = categories.findIndex(
        (cat) => cat.name === newCategory
      );

      if (verifDoublou === -1) {
        const apiUrl = "https://mcfabric.netlify.app/api/categorie/add";
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
        setNewCategory("");
        //Si la catégorie est déjà présente dans la BDD
        setNewCategoryError(2);
        setTimeout(() => {
          setNewCategoryError(0);
        }, 3000);
      }
    } else {
      //Si la catégorie est vide
      setNewCategoryError(1);
      setTimeout(() => {
        setNewCategoryError(0);
      }, 3000);
    }
  };

  //Supprimer une catégorie
  const handleDeleteCategory = (id) => {
    const shouldDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer la catégorie ?"
    );
    if (!shouldDelete) {
      return; // Abort the deletion if the user cancels
    } else {
      const apiUrl = "https://mcfabric.netlify.app/api/categorie/delete/" + id;
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
    <div>
      <div className="gestion-categorie">
        <h2>Gestion catégories</h2>
        <div className="categorie-form">
          <input
            type="text"
            placeholder="Nouvelle catégorie"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button
            className="btn btn-admin btn-primary margin-left"
            onClick={handleAddCategory}
          >
            Ajouter
          </button>
        </div>

        <div className="row">
          {categories.map((category, index) => (
            <div
              className="categorie-list col-xl-3 col-lg-4 col-sm-6"
              key={index}
            >
              <input type="text" value={category.name} disabled />
              <button
                className="btn btn-admin btn-danger"
                onClick={() => handleDeleteCategory(category.id)}
              >
                <AiOutlineDelete size={25} />
              </button>
            </div>
          ))}
        </div>
        {newCategoryError === 1 && (
          <ShowInfoPopup
            msg="Impossible d'ajouter une catégorie vide"
            type="error"
          ></ShowInfoPopup>
        )}
        {newCategoryError === 2 && (
          <ShowInfoPopup
            msg="Impossible d'ajouter 2 fois la même catégorie"
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
    </div>
  );
};

export default ShowCategory;
