import React from "react";
import "./FilterProduct.scss";
import {
  TbSortAscendingNumbers,
  TbSortDescendingNumbers,
} from "react-icons/tb";
import { GiCardboardBoxClosed } from "react-icons/gi";
import { BiEuro } from "react-icons/bi";

const FilterProduct = ({
  categories,
  setFilterCategorie,
  filterStock,
  setFilterStock,
  setFilterPage,
  setFilterPrice,
  filterPrice,
}) => {
  const handleFilterStock = (type) => {
    if (filterStock === type) {
      setFilterStock("empty");
    } else {
      setFilterPrice("empty");
      setFilterStock(type);
    }
  };

  const handleFilterPrice = (type) => {
    if (filterPrice === type) {
      setFilterPrice("empty");
    } else {
      setFilterStock("empty");
      setFilterPrice(type);
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

      <button
        className={`btn filter4 ${
          filterPrice === "asc" ? "btn-dark" : "btn-outline-dark"
        }`}
        onClick={() => handleFilterPrice("asc")}
      >
        <TbSortAscendingNumbers size={25} />
        <div>
          <BiEuro size={30} />
        </div>
      </button>
      <button
        className={`btn filter5 ${
          filterPrice === "desc" ? "btn-dark" : "btn-outline-dark"
        }`}
        onClick={() => handleFilterPrice("desc")}
      >
        <TbSortDescendingNumbers size={25} />
        <div>
          <BiEuro size={30} />
        </div>
      </button>
    </div>
  );
};

export default FilterProduct;
