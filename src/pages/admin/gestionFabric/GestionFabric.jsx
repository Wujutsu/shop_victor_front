import React, { useContext, useEffect, useState } from "react";
import "./GestionFabric.scss";
import { UserContext } from "../../../contexts/UserContext";
import axios from "axios";
import { convertDataImg } from "../../../utils/functionUtils";
import ListFabric from "./listFabric/ShowFabric";
import AddFabric from "./addFabric/AddFabric";
import Spinner from "../../../components/spinner/Spinner";

const GestionFabric = () => {
  const { token } = useContext(UserContext);
  const [listFabric, setListFabric] = useState([]);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAllFabric = () => {
      setIsLoading(true);

      const apiUrl = "http://localhost:8080/api/fabric/all";
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      axios
        .get(apiUrl, config)
        .then((response) => {
          const updateListFabric = response.data.map((fabric) => {
            return { ...fabric, picture: convertDataImg(fabric.picture) };
          });
          setListFabric(updateListFabric);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
        });
    };

    getAllFabric();
  }, [token]);

  const handleDeleteFabric = (id) => {
    const shouldDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer le tissu ?"
    );

    if (shouldDelete) {
      const apiUrl = "http://localhost:8080/api/fabric/delete/" + id;
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
            const updateListFabric = listFabric.filter(
              (fabric) => fabric.id !== id
            );
            setListFabric(updateListFabric);
          }
        })
        .catch((error) => {});
    }
  };

  return (
    <div className="gestion-fabric">
      <h2>Gestion tissus</h2>

      <button
        className="btn btn-admin btn-primary"
        onClick={() => setShowModalAdd(true)}
      >
        Ajouter un tissu
      </button>

      <div className="list-fabric">
        <div className="row">
          <AddFabric
            setShowModalAdd={setShowModalAdd}
            showModalAdd={showModalAdd}
            listFabric={listFabric}
            setListFabric={setListFabric}
          />

          {!isLoading ? (
            <>
              {listFabric.map((fabric, index) => (
                <ListFabric
                  fabric={fabric}
                  key={index}
                  handleDeleteFabric={handleDeleteFabric}
                />
              ))}
            </>
          ) : (
            <Spinner page={false} />
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionFabric;
