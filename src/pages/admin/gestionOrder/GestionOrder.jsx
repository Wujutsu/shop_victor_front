import React, { useContext, useEffect, useState } from "react";
import "./GestionOrder.scss";
import axios from "axios";
import { UserContext } from "../../../contexts/UserContext";
import { formatTimestamp, convertDataImg } from "../../../utils/functionUtils";

import Spinner from "../../../components/spinner/Spinner";
import FilterOrder from "./filterOrder/FilterOrder";
import ShowListOrder from "./showListOrder/ShowListOrder";
import Paging from "./paging/Paging";

const GestionOrder = () => {
  const { token } = useContext(UserContext);
  const [filterState, setFilterState] = useState(0);
  const [filterPage, setFilterPage] = useState(0);
  const [listOrder, setListOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    //Récupére toutes les commandes en fonction de l'état et du numéro de page
    const getAllOrder = () => {
      setIsLoading(true);

      const apiUrl =
        "http://localhost:8080/api/order/all/" + filterState + "/" + filterPage;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      axios
        .get(apiUrl, config)
        .then((response) => {
          const updateListOrder = response.data.map((order) => {
            const updateProductList = order.productList.map((product) => {
              let updateOptionFabric = null;
              if (product.optionFabric !== null) {
                updateOptionFabric = {
                  ...product.optionFabric,
                  picture: convertDataImg(product.optionFabric.picture),
                };
              }

              return {
                ...product,
                picture: convertDataImg(product.picture),
                optionFabric: updateOptionFabric,
              };
            });

            return {
              ...order,
              orderDate: formatTimestamp(order.orderDate),
              productList: updateProductList,
              disabled: false,
            };
          });

          console.log("AFTER => ", updateListOrder);

          setListOrder(updateListOrder);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
        });
    };

    getAllOrder();
  }, [token, filterState, filterPage]);

  return (
    <div className="gestion-order">
      <h2>Gestion commandes</h2>

      <FilterOrder
        setFilterState={setFilterState}
        filterState={filterState}
        setFilterPage={setFilterPage}
        listOrder={listOrder}
      />

      {isLoading ? (
        <Spinner page={false} />
      ) : (
        <>
          <ShowListOrder listOrder={listOrder} setListOrder={setListOrder} />
          <Paging
            setFilterPage={setFilterPage}
            filterPage={filterPage}
            filterState={filterState}
          />
        </>
      )}
    </div>
  );
};

export default GestionOrder;
