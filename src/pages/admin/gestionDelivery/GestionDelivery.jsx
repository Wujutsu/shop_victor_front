import React, { useContext, useEffect, useState } from "react";
import "./GestionDelivery.scss";
import { AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import { formatTarif } from "../../../utils/functionUtils";
import { UserContext } from "../../../contexts/UserContext";

const GestionDelivery = () => {
  const { token } = useContext(UserContext);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [disabledBtnModalAdd, setDisabledBtnModalAdd] = useState(true);
  const [listTypeDelivery, setListTypeDelivery] = useState([]);
  const [newDelivery, setNewDelivery] = useState({
    name: "",
    time: "",
    price: "",
  });

  useEffect(() => {
    const getAllTypeDelivery = () => {
      const apiUrl = "http://localhost:8080/api/delivery/all";

      axios
        .get(apiUrl)
        .then((response) => {
          setListTypeDelivery(response.data);
        })
        .catch((error) => {});
    };

    getAllTypeDelivery();
  }, []);

  const updateInputNewDelivery = (field, val) => {
    const updateNewDelivery = { ...newDelivery };
    updateNewDelivery[field] = val;
    setNewDelivery(updateNewDelivery);

    if (
      updateNewDelivery["name"].length > 0 &&
      updateNewDelivery["time"].length > 0 &&
      updateNewDelivery["price"].length > 0 &&
      !isNaN(updateNewDelivery["time"]) &&
      !isNaN(formatTarif(updateNewDelivery["price"]))
    ) {
      setDisabledBtnModalAdd(false);
    } else {
      setDisabledBtnModalAdd(true);
    }
  };

  const handleAddNewDelivery = () => {
    const apiUrl = "http://localhost:8080/api/delivery/add";
    const data = {
      name: newDelivery.name,
      time: newDelivery.time,
      price: formatTarif(newDelivery.price),
    };
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    axios
      .post(apiUrl, data, config)
      .then((response) => {
        const updateListDelivery = [...listTypeDelivery];
        updateListDelivery.push(response.data);
        setListTypeDelivery(updateListDelivery);
        handleCancleAddDelivery();
      })
      .catch((error) => {
        console.log("error => ", error);
      });
  };

  const handleDeleteDelivery = (id) => {
    const shouldDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer le type de livraison ?"
    );

    if (shouldDelete) {
      const apiUrl = "http://localhost:8080/api/delivery/delete/" + id;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      axios.delete(apiUrl, config).then((response) => {
        const updateDelivery = listTypeDelivery.filter(
          (item) => item.id !== id
        );
        setListTypeDelivery(updateDelivery);
      });
    }
  };

  const handleCancleAddDelivery = () => {
    setShowModalAdd(false);
    setDisabledBtnModalAdd(true);
    setNewDelivery({
      name: "",
      time: "",
      price: "",
    });
  };

  return (
    <div className="gestion-delivery">
      <h2>Gestion tarifs livraison</h2>

      <button
        className="btn btn-admin btn-primary mb-3"
        onClick={() => setShowModalAdd(true)}
      >
        Ajouter livraison
      </button>

      {showModalAdd ? (
        <div className="row">
          <div className="col-md-5 col-sm-6">
            <div className="new-delivery">
              <div className="form-input">
                <label htmlFor="transporteur">Transporteur</label>
                <input
                  type="text"
                  value={newDelivery.name}
                  onChange={(e) =>
                    updateInputNewDelivery("name", e.target.value)
                  }
                />
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="form-input">
                    <label htmlFor="jourOuvre">Jours ouvrés</label>
                    <input
                      type="text"
                      value={newDelivery.time}
                      onChange={(e) =>
                        updateInputNewDelivery("time", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-input">
                    <label htmlFor="tarif">Tarif</label>
                    <input
                      type="text"
                      value={newDelivery.price}
                      onChange={(e) =>
                        updateInputNewDelivery("price", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <button
                disabled={disabledBtnModalAdd}
                className="btn btn-primary btn-admin btn-add"
                onClick={() => handleAddNewDelivery()}
              >
                Ajouter
              </button>
              <button
                className="btn btn-danger btn-admin"
                onClick={() => handleCancleAddDelivery()}
              >
                Annuler
              </button>
            </div>
          </div>
          <div className="col-md-7 col-sm-6">
            <div className="row">
              {listTypeDelivery.map((item, index) => (
                <div key={index} className="col-lg-6 col-md-12">
                  <div className="box-info">
                    <div className="transporteur">{item.name}</div>
                    <div className="ouvre">
                      {item.price}&nbsp;€ ({item.time} jours ouvrés)
                    </div>
                    <button
                      className="btn btn-admin btn-danger"
                      onClick={() => handleDeleteDelivery(item.id)}
                    >
                      <AiOutlineDelete size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          {listTypeDelivery.map((item, index) => (
            <div key={index} className="col-lg-4 col-md-6 col-sm-6">
              <div className="box-info">
                <div className="transporteur">{item.name}</div>
                <div className="ouvre">
                  {item.price}&nbsp;€ ({item.time} jours ouvrés)
                </div>
                <button
                  className="btn btn-admin btn-danger"
                  onClick={() => handleDeleteDelivery(item.id)}
                >
                  <AiOutlineDelete size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GestionDelivery;
