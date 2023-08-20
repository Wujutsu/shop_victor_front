import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../contexts/UserContext";
import { AiOutlineFieldTime, AiOutlineCheckCircle } from "react-icons/ai";
import { RiMailSendLine } from "react-icons/ri";

const FilterOrder = ({
  setFilterState,
  filterState,
  setFilterPage,
  listOrder,
}) => {
  const { token } = useContext(UserContext);
  const [nbOrderByState, setNbOrderByState] = useState({});

  // Permet de connaitre le nombre de commande en fonction de l'état des commandes (0, 1, 2, 3)
  useEffect(() => {
    const getCountOrdersByState = () => {
      const apiUrl = "http://localhost:8080/api/order/nb";
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      axios
        .get(apiUrl, config)
        .then((response) => {
          setNbOrderByState(response.data);
        })
        .catch((error) => {});
    };

    getCountOrdersByState();
  }, [token, filterState, listOrder]);

  return (
    <div className="filtre">
      <button
        onClick={() => {
          setFilterState(0);
          setFilterPage(0);
        }}
        className={`btn ${filterState === 0 ? "btn-dark" : "btn-outline-dark"}`}
      >
        <AiOutlineFieldTime size={25} /> A&nbsp;traiter{" "}
        {nbOrderByState[0] ? " (" + nbOrderByState[0] + ")" : "(0)"}
      </button>
      <button
        onClick={() => {
          setFilterState(1);
          setFilterPage(0);
        }}
        className={`btn ${filterState === 1 ? "btn-dark" : "btn-outline-dark"}`}
      >
        <RiMailSendLine size={22} />
        A&nbsp;envoyer
        {nbOrderByState[1] ? " (" + nbOrderByState[1] + ")" : "(0)"}
      </button>
      <button
        onClick={() => {
          setFilterState(2);
          setFilterPage(0);
        }}
        className={`btn ${filterState === 2 ? "btn-dark" : "btn-outline-dark"}`}
      >
        <AiOutlineCheckCircle size={25} />
        Validé {nbOrderByState[2] ? " (" + nbOrderByState[2] + ")" : "(0)"}
      </button>
    </div>
  );
};

export default FilterOrder;
