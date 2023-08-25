import React, { useContext, useEffect, useState } from "react";
import {
  BsFillArrowRightCircleFill,
  BsFillArrowLeftCircleFill,
} from "react-icons/bs";
import { UserContext } from "../../../../contexts/UserContext";
import axios from "axios";

const Paging = ({ setFilterPage, filterPage, filterState }) => {
  const { token } = useContext(UserContext);
  const [nbPageToShow, setNbPageToShow] = useState(0);

  useEffect(() => {
    //Récupére le nombre de page à afficher
    const getNbPage = () => {
      const apiUrl =
        "https://mcfabric.netlify.app/api/order/nbpage/" + filterState;
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
  }, [token, filterState]);

  const handlePagePrecedente = () => {
    setFilterPage(filterPage - 1);
    scrollToTop();
  };

  const handlePageSuivante = () => {
    setFilterPage(filterPage + 1);
    scrollToTop();
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Permet un défilement fluide
    });
  };

  return (
    <>
      {nbPageToShow > 0 && (
        <div className="page">
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
    </>
  );
};

export default Paging;
