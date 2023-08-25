import React, { useContext, useEffect, useState } from "react";
import {
  BsFillArrowRightCircleFill,
  BsFillArrowLeftCircleFill,
} from "react-icons/bs";
import { UserContext } from "../../../../contexts/UserContext";
import axios from "axios";
import "./Paging.scss";

const Paging = ({ filterPage, setFilterPage, filterCategorie }) => {
  const { token } = useContext(UserContext);
  const [nbPageToShow, setNbPageToShow] = useState(0);

  useEffect(() => {
    //Récupére le nombre de page à afficher
    const getNbPage = () => {
      const filterQuantityMinToShow = 1;
      const apiUrl =
        "http://localhost:3000/api/product/all/nbpage/" +
        filterCategorie +
        "/" +
        filterQuantityMinToShow;
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
    scrollToTop();
    setFilterPage(filterPage - 1);
  };

  const handlePageSuivante = () => {
    scrollToTop();
    setFilterPage(filterPage + 1);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 200,
      behavior: "smooth",
    });
  };

  return (
    <div className="page-shop">
      {nbPageToShow > 0 && (
        <div className="paging">
          {filterPage > 0 ? (
            <div className="left" onClick={() => handlePagePrecedente()}>
              <BsFillArrowLeftCircleFill size={30} color="#76aa70" />
            </div>
          ) : (
            <div className="left">
              <BsFillArrowLeftCircleFill size={30} />
            </div>
          )}
          <div className="number">{filterPage + 1}</div>

          {filterPage !== nbPageToShow ? (
            <div className="right" onClick={() => handlePageSuivante()}>
              <BsFillArrowRightCircleFill size={30} color="#76aa70" />
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
