import React, { useContext, useEffect, useState } from "react";
import "./Filter.scss";
import { UserContext } from "../../../../contexts/UserContext";
import axios from "axios";

const Filter = ({ filterCategorie, setFilterCategorie, setFilterPage }) => {
  const { token } = useContext(UserContext);
  const [listCategorie, setListCategorie] = useState([]);

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
          setListCategorie(response.data);
        })
        .catch((error) => {});
    };

    getAllCategories();
  }, [token, setListCategorie]);

  const handleSelectedCategorie = (categorie) => {
    setFilterCategorie(categorie);
    setFilterPage(0);
  };

  return (
    <div className="filter">
      <button
        className={`btn ${
          filterCategorie === "all" ? "btn-success" : "btn-outline-success"
        }`}
        onClick={() => handleSelectedCategorie("all")}
      >
        Tout
      </button>
      {listCategorie.map((item) => (
        <button
          key={item.id}
          className={`btn ${
            filterCategorie === item.name
              ? "btn-success"
              : "btn-outline-success"
          }`}
          onClick={() => handleSelectedCategorie(item.name)}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};

export default Filter;
