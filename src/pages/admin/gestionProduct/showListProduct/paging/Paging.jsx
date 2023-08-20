import React, { useContext, useEffect, useState } from "react";
import {
  BsFillArrowRightCircleFill,
  BsFillArrowLeftCircleFill,
} from "react-icons/bs";
import { UserContext } from "../../../../../contexts/UserContext";
import axios from "axios";
import "./Paging.scss";

const Paging = ({ filterPage, setFilterPage, filterCategorie }) => {
  const { token } = useContext(UserContext);
  const [nbPageToShow, setNbPageToShow] = useState(0);

  useEffect(() => {
    console.log("Page");
    //Récupére le nombre de page à afficher
    const getNbPage = () => {
      const apiUrl =
        "http://localhost:8080/api/product/all/nbpage/" + filterCategorie;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      axios
        .get(apiUrl, config)
        .then((response) => {
          setNbPageToShow(parseInt(response.data) - 1);
        })
        .catch((error) => {});
    };

    getNbPage();
  }, [token, filterCategorie]);

  const handlePagePrecedente = () => {
    setFilterPage(filterPage - 1);
  };

  const handlePageSuivante = () => {
    setFilterPage(filterPage + 1);
  };

  return (
    <div>
      {nbPageToShow > 0 && (
        <div className="page">
          {filterPage > 0 ? (
            <div className="left" onClick={() => handlePagePrecedente()}>
              <BsFillArrowLeftCircleFill size={30} color="#136893" />
            </div>
          ) : (
            <div className="left">
              <BsFillArrowLeftCircleFill size={30} />
            </div>
          )}
          <div className="number">{filterPage + 1}</div>

          {filterPage !== nbPageToShow ? (
            <div className="right" onClick={() => handlePageSuivante()}>
              <BsFillArrowRightCircleFill size={30} color="#136893" />
            </div>
          ) : (
            <div className="right">
              <BsFillArrowRightCircleFill size={30} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Paging;
