import React, { useContext, useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import axios from "axios";
import { UserContext } from "../../../../contexts/UserContext";
import { AiOutlineDelete } from "react-icons/ai";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Address = () => {
  const { token, setAddressOrder, phoneNumber, setPhoneNumber } =
    useContext(UserContext);
  const [showInputAddress, setShowInputAddress] = useState(false);
  const [dataNewAddress, setDataNewAddress] = useState({
    country: "",
    codePostal: "",
    city: "",
    number: "",
    address: "",
    identity: "",
    focus: false,
  });
  const [listAddress, setListAddress] = useState([]);

  useEffect(() => {
    //Récupére la liste des adresses
    const getListAddressSave = () => {
      const apiUrl = "http://localhost:8080/api/user/list/address";
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      axios
        .get(apiUrl, config)
        .then((response) => {
          const listAddressRecup = response.data.map((address, index) =>
            index === 0
              ? {
                  ...address,
                  focus: true,
                }
              : {
                  ...address,
                  focus: false,
                }
          );
          setListAddress(listAddressRecup);
        })
        .catch((error) => {});
    };

    getListAddressSave();
  }, [token]);

  //Permet de mettre à jour l'adresse focus dans le UserContext
  useEffect(() => {
    const updateAddressOrderFocus = () => {
      const selectAddressFocus = listAddress.find((adr) => adr.focus);
      setAddressOrder(selectAddressFocus);
    };

    updateAddressOrderFocus();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listAddress]);

  // Permet de modifier la valeur des champs input
  const handleUpdateInput = (field, val) => {
    const updateInput = { ...dataNewAddress };
    updateInput[field] = val;
    setDataNewAddress(updateInput);
  };

  // Annule l'ajout d'une nouvelle adresse
  const handleCancleAddAddress = () => {
    setShowInputAddress(false);
    setDataNewAddress({
      country: "",
      codePostal: "",
      city: "",
      number: "",
      address: "",
      identity: "",
    });
  };

  // Enregistre une nouvelle adresse
  const handleAddAddress = (e) => {
    e.preventDefault();

    const apiUrl = "http://localhost:8080/api/user/add/address";
    const requestData = {
      country: dataNewAddress.country,
      codePostal: dataNewAddress.codePostal,
      city: dataNewAddress.city,
      number: dataNewAddress.number,
      address: dataNewAddress.address,
      identity: dataNewAddress.identity,
    };
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    axios
      .post(apiUrl, requestData, config)
      .then((response) => {
        //UnFocus toutes les adresses :
        const updateListAddress = listAddress.map((address, i) => ({
          ...address,
          focus: false,
        }));
        //Enregistre avec la nouvelle adresse et la focus
        setListAddress([
          ...updateListAddress,
          { ...response.data, focus: true },
        ]);

        handleCancleAddAddress();
      })
      .catch((error) => {});
  };

  //Focus une adresse
  const handleFocusAddress = (index) => {
    const updateAddresse = listAddress.map((address, i) =>
      i === index
        ? { ...address, focus: !address.focus }
        : { ...address, focus: false }
    );
    setListAddress(updateAddresse);
  };

  //Supprime une adresse de la liste
  const handleDeleteAddress = (id) => {
    const shouldDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer l'adresse ?"
    );

    if (shouldDelete) {
      const apiUrl = "http://localhost:8080/api/user/delete/address/" + id;
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
            const updatedListAddress = listAddress.filter(
              (adr) => adr.id !== id
            );
            setListAddress(updatedListAddress);
          }
        })
        .catch((error) => {});
    }
  };

  return (
    <div className="cart">
      <h4>
        <b>1. Adresse de livraison</b>
      </h4>
      <div className="row">
        <div className="col-12">
          {listAddress.map((item, index) => (
            <div key={index} className="loop-address">
              <div
                className={`address-saved ${item.focus && "focus"}`}
                onClick={() => handleFocusAddress(index)}
              >
                <div>{item.identity}</div>
                <div>
                  {item.number} {item.address}, {item.city}
                </div>
                <div>
                  {item.codePostal}, {item.country}
                </div>
              </div>

              <button
                className="btn btn-primary btn-delete"
                onClick={() => handleDeleteAddress(item.id)}
              >
                <AiOutlineDelete size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="col-12">
          <button
            className={`btn btn-primary mt-2 mb-3 ${
              showInputAddress && "d-none"
            }`}
            onClick={() => setShowInputAddress(true)}
          >
            <div>
              <AiOutlinePlus size={18} /> Ajouter une adresse
            </div>
          </button>

          <form
            className={`row form-add-address ${!showInputAddress && "d-none"}`}
            onSubmit={handleAddAddress}
            name="add-address"
          >
            <div className="col-6 mb-2 form-input">
              <label htmlFor="identity">Identité</label>
              <input
                type="text"
                required
                autoComplete="off"
                value={dataNewAddress.identity}
                name="identity"
                id="identity"
                placeholder="Prénom Nom"
                maxLength={50}
                onChange={(e) => handleUpdateInput("identity", e.target.value)}
              />
            </div>
            <div className="col-6 mb-2 form-input">
              <label htmlFor="country">Pays</label>
              <input
                type="text"
                required
                autoComplete="off"
                name="country"
                id="country"
                value={dataNewAddress.country}
                maxLength={50}
                onChange={(e) => handleUpdateInput("country", e.target.value)}
              />
            </div>
            <div className="col-6 mt-4 mb-2 form-input">
              <label htmlFor="city">Ville</label>
              <input
                type="text"
                required
                autoComplete="off"
                value={dataNewAddress.city}
                name="city"
                id="city"
                maxLength={50}
                onChange={(e) => handleUpdateInput("city", e.target.value)}
              />
            </div>
            <div className="col-6 mt-4 mb-2 form-input">
              <label htmlFor="cp">Code postal</label>
              <input
                type="text"
                required
                autoComplete="off"
                value={dataNewAddress.codePostal}
                name="codePostal"
                id="codePostal"
                maxLength={5}
                onChange={(e) =>
                  handleUpdateInput("codePostal", e.target.value)
                }
              />
            </div>
            <div className="col-md-3 col-sm-2 mt-4 mb-2 form-input">
              <label htmlFor="address">Numéro</label>
              <input
                type="text"
                required
                autoComplete="off"
                value={dataNewAddress.number}
                name="number"
                id="number"
                maxLength={4}
                onChange={(e) => handleUpdateInput("number", e.target.value)}
              />
            </div>
            <div className="col-md-9 col-sm-10 mt-4 mb-2 form-input">
              <label htmlFor="address">Adresse</label>
              <input
                type="text"
                required
                autoComplete="off"
                value={dataNewAddress.address}
                name="address"
                id="address"
                maxLength={150}
                onChange={(e) => handleUpdateInput("address", e.target.value)}
              />
            </div>
            <button
              className="btn btn-danger"
              onClick={() => handleCancleAddAddress()}
              type="button"
            >
              Annuler
            </button>
            <button className="btn btn-success" type="submit">
              Enregistrer
            </button>
          </form>
        </div>

        <div className="col-12">
          <label htmlFor="phone">Numéro de téléphone *</label>
          <PhoneInput
            country={"fr"}
            value={phoneNumber}
            onChange={(phoneNumber) => setPhoneNumber(phoneNumber)}
            placeholder=""
          />
        </div>
      </div>
    </div>
  );
};

export default Address;
