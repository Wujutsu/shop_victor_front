import React, { useContext, useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import axios from "axios";
import { UserContext } from "../../../../contexts/UserContext";
import { AiOutlineDelete } from "react-icons/ai";
import { formatPhoneNumber } from "../../../../utils/functionUtils";

const Address = () => {
  const { token, phoneNumber, setAddressOrder } = useContext(UserContext);
  const [showInputAddress, setShowInputAddress] = useState(false);
  const [dataNewAddress, setDataNewAddress] = useState({
    country: "",
    codePostal: "",
    city: "",
    address: "",
    identity: "",
    focus: false,
  });
  const [listAddress, setListAddress] = useState([]);
  const [inputPhone, setInputPhone] = useState(phoneNumber);

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

  //Met à jour le numéro de téléphone
  const handleUpdatePhoneNumber = (num) => {
    //Permet de modifier la valeur de l'input
    const formattedPhoneNumber = formatPhoneNumber(num);
    if (formattedPhoneNumber.length <= 14) {
      setInputPhone(formattedPhoneNumber);
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
                  {item.address}, {item.city}
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
                onChange={(e) =>
                  handleUpdateInput("codePostal", e.target.value)
                }
              />
            </div>
            <div className="col-12 mt-4 mb-2 form-input">
              <label htmlFor="address">Adresse</label>
              <input
                type="text"
                required
                autoComplete="off"
                value={dataNewAddress.address}
                name="address"
                id="address"
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

        <div className="col-12 form-input">
          <label htmlFor="phone">Numéro de téléphone</label>
          <input
            type="tel"
            value={inputPhone}
            onChange={(e) => handleUpdatePhoneNumber(e.target.value)}
            pattern="[A-Za-z]{3}"
            required
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
};

export default Address;