import React from "react";
import "./FilterProduct.scss";
import {
  TbSortAscendingNumbers,
  TbSortDescendingNumbers,
} from "react-icons/tb";
import { GiCardboardBoxClosed } from "react-icons/gi";

const FilterProduct = ({
  categories,
  setFilterCategorie,
  filterStock,
  setFilterStock,
  setFilterPage,
}) => {
  const handleFilterStock = (type) => {
    if (filterStock === type) {
      setFilterStock("empty");
    } else {
      setFilterStock(type);
    }
  };

  const handleFilterCategorie = (categorie) => {
    setFilterCategorie(categorie);
    setFilterPage(0);
  };

  return (
    <div className="filter-product">
      <select
        name="filterCategorie"
        id="filterCategorie"
        className="filter1"
        onChange={(e) => handleFilterCategorie(e.target.value)}
      >
        <option value="all">Toutes catégories</option>

        {categories.map((cat, key) => (
          <option key={key} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      <button
        className={`btn filter2 ${
          filterStock === "asc" ? "btn-dark" : "btn-outline-dark"
        }`}
        onClick={() => handleFilterStock("asc")}
      >
        <TbSortAscendingNumbers size={25} />
        <div>
          <GiCardboardBoxClosed size={30} />
        </div>
      </button>

      <button
        className={`btn filter3 ${
          filterStock === "desc" ? "btn-dark" : "btn-outline-dark"
        }`}
        onClick={() => handleFilterStock("desc")}
      >
        <TbSortDescendingNumbers size={25} />
        <div>
          <GiCardboardBoxClosed size={30} />
        </div>
      </button>
    </div>
  );
};

export default FilterProduct;
