import React, { useContext, useState } from "react";
import "./AddFabric.scss";
import { BsCloudDownload } from "react-icons/bs";
import { RxCrossCircled } from "react-icons/rx";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { UserContext } from "../../../../contexts/UserContext";
import axios from "axios";
import { convertDataImg } from "../../../../utils/functionUtils";
import Compressor from "compressorjs";

const AddFabric = ({
  setShowModalAdd,
  showModalAdd,
  listFabric,
  setListFabric,
}) => {
  const { token } = useContext(UserContext);
  const [img, setImg] = useState("");
  const [newFabricPicture, setNewFabricPicture] = useState("");
  const [newFabricName, setNewFabricName] = useState("");

  //Sélectionne une image et la convertie en byte[] et renvoie un lien pour afficher l'image
  const handleFileChangeUpload = async (event) => {
    const dataPicture = event.target.files[0];
    if (dataPicture !== undefined) {
      // Convertir l'image en blob
      const blob = new Blob([dataPicture], { type: dataPicture.type });

      // Créer une URL blob à partir de l'objet Blob
      const imgUrl = URL.createObjectURL(blob);
      setImg(imgUrl);

      // Déterminer la qualité en fonction de la taille de l'image d'origine
      let targetQuality = 0.7;
      const imageSizeKb = blob.size / 1024;
      if (imageSizeKb > 900) {
        targetQuality = 0.2; // par exemple, pour les images > 900 Ko
      } else if (imageSizeKb > 150) {
        targetQuality = 0.5; // par exemple, pour les images > 150 Ko
      }

      // Compression de l'image
      new Compressor(blob, {
        quality: 0.7,
        maxWidth: 800,
        maxHeight: 800,
        success: async (resultBlob) => {
          const compressedByteArray = await resultBlob.arrayBuffer();
          const compressedByteArrayAsArray = Array.from(
            new Uint8Array(compressedByteArray)
          );

          setNewFabricPicture(compressedByteArrayAsArray);
        },
        error: (error) => {
          console.error(
            "Erreur lors de la compression de l'image :",
            error.message
          );
        },
      });
    }
  };

  const handleCancel = () => {
    setImg("");
    setNewFabricName("");
    setNewFabricPicture("");
    setShowModalAdd(false);
  };

  const handleAddFabric = () => {
    const apiUrl = "http://localhost:8080/api/fabric/add";
    const requestData = {
      name: newFabricName,
      picture: newFabricPicture,
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
        const updateListFabric = [...listFabric];
        updateListFabric.push({
          ...response.data,
          picture: convertDataImg(response.data.picture),
        });
        setListFabric(updateListFabric);
        handleCancel();
      })
      .catch((error) => {});
  };

  return (
    <>
      {showModalAdd && (
        <div className="col-lg-2 col-md-3 col-sm-4 col-6 add-fabric">
          <div className="fabric" style={{ backgroundImage: `url(${img})` }}>
            <div className="btn btn-primary btn-admin file-upload">
              <label className="input-perso">
                <span className="select-img">
                  <BsCloudDownload size={15} /> Image
                </span>
                <input
                  type="file"
                  className="input-file"
                  accept="image/jpg, image/jpeg"
                  onChange={(e) => handleFileChangeUpload(e)}
                />
              </label>
            </div>

            <input
              placeholder="Nom"
              type="text"
              value={newFabricName}
              onChange={(e) => setNewFabricName(e.target.value)}
              autoComplete="off"
              required
            />

            <div className="validation">
              <button
                className="btn btn-admin btn-danger"
                onClick={() => handleCancel()}
              >
                <RxCrossCircled size={25} />
              </button>

              {newFabricName !== "" && newFabricPicture !== "" && (
                <button
                  className="btn btn-admin btn-success"
                  onClick={() => handleAddFabric()}
                >
                  <AiOutlineCheckCircle size={25} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddFabric;
