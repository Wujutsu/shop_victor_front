import React, { useState } from "react";
import "./FormContact.scss";
import axios from "axios";
import ShowInfoPopup from "../../../components/showInfoPopup/ShowInfoPopup";

const FormContact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sujet, setSujet] = useState("");
  const [request, setRequest] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [disabledBtn, setDisabledBtn] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setDisabledBtn(true);

    const apiUrl = "http://localhost:8080/api/email/ask";
    const requestData = {
      from: email.toLowerCase(),
      identity: name,
      subject: sujet,
      content: request,
    };

    axios
      .post(apiUrl, requestData)
      .then((response) => {
        console.log("response => ", response.data);
        if (response.data) {
          setName("");
          setEmail("");
          setSujet("");
          setRequest("");
          setDisabledBtn(false);
          setEmailStatus("Votre demande à bien été envoyée");
          setTimeout(() => {
            setEmailStatus("");
          }, 3000);
        }
      })
      .catch((error) => {
        setDisabledBtn(false);
      });
  };

  return (
    <div className="contact">
      <h2>Une idée, une envie, des questions&nbsp;?</h2>

      <div className="form-contact">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              placeholder="Nom"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <select
              name="sujet"
              id="sujet"
              onChange={(e) => setSujet(e.target.value)}
              required
              value={sujet}
            >
              <option value=""></option>
              <option value="Demande de Création sur Mesure">
                Demande de Création sur Mesure
              </option>
              <option value="Reprises Couture et Ourlets">
                Reprises Couture et Ourlets
              </option>
              <option value="Questions sur les Produits">
                Questions sur les Produits
              </option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div className="form-group">
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Demande moi ce que tu souhaites"
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-success"
            disabled={disabledBtn}
          >
            Envoyer la Demande
          </button>
        </form>
      </div>

      {emailStatus !== "" && <ShowInfoPopup msg={emailStatus} type="success" />}
    </div>
  );
};

export default FormContact;
