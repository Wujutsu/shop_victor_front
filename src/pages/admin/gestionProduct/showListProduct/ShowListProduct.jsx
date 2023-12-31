import axios from "axios";
import React, { useContext, useState } from "react";
import { UserContext } from "../../../../contexts/UserContext";
import { BsPen } from "react-icons/bs";
import { RxCrossCircled } from "react-icons/rx";
import { BiInfinite } from "react-icons/bi";
import { AiOutlineCheckCircle, AiOutlineDelete } from "react-icons/ai";
import { formatTarif } from "../../../../utils/functionUtils";
import "./ShowListProduct.scss";
import ShowInfoPopup from "../../../../components/showInfoPopup/ShowInfoPopup";
import { GiCardboardBoxClosed } from "react-icons/gi";
import { BsCloudDownload } from "react-icons/bs";
import Compressor from "compressorjs";

const ShowListProduct = ({
  listProduct,
  setListProduct,
  saveListProduct,
  setSaveListProduct,
  categories,
  isLoading,
}) => {
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const { token } = useContext(UserContext);
  const [updateError, setUpdateError] = useState("");

  //Permet de undisabled un item pour modifier des champs du produit
  const handleDisabledFalse = (index) => {
    const unDisabledProduct = saveListProduct.map((item, i) => {
      if (i === index) {
        return { ...item, isDisabled: false };
      }
      return { ...item, isDisabled: true };
    });

    setListProduct(unDisabledProduct);
  };

  //Annule tous les changements
  const handleDisabledTrue = () => {
    setListProduct(saveListProduct);
  };

  //Permet de modifier les champs input d'un produit
  const handleInputChange = (index, field, value) => {
    const updatedListProduct = listProduct.map((item, i) => {
      if (index === i) {
        return { ...item, [field]: value };
      } else {
        return { ...item };
      }
    });

    setListProduct(updatedListProduct);
  };

  //Permet de modifier les champs select d'un produit pour la categorie
  const handleSelectChange = (categorySelect, indexProduit) => {
    //Récupére les infos de la catégorie en bdd
    const recupInfoCategory = categories.find(
      (item) => item.name === categorySelect
    );

    if (recupInfoCategory !== undefined) {
      const updateListProduct = [...listProduct];
      updateListProduct[indexProduit].categorie = recupInfoCategory;
      setListProduct(updateListProduct);
    }
  };

  //Permet de modifier la quantité en stock d'un produit
  const handleQuantityChange = (index, typeIncre) => {
    const updatedListProduct = listProduct.map((item, i) => {
      if (index === i) {
        return {
          ...item,
          stockQuantity:
            typeIncre === "+"
              ? parseInt(item.stockQuantity) + 1
              : parseInt(item.stockQuantity) - 1,
          stockInfinite: false,
        };
      } else {
        return { ...item };
      }
    });

    setListProduct(updatedListProduct);
  };

  //Permet de mettre un stock en infini
  const handleStockInfini = (index) => {
    const updatedListProduct = listProduct.map((item, i) => {
      if (index === i) {
        return {
          ...item,
          stockQuantity: 1,
          stockInfinite: true,
        };
      } else {
        return { ...item };
      }
    });

    setListProduct(updatedListProduct);
  };

  // Permet de supprimer un produit définitivement de la BDD
  const handleDeleteProduct = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer le produit ?")) {
      const apiUrl = "http://localhost:8080/api/product/delete/" + id;
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
            const updateListProduct = listProduct.filter(
              (product) => product.id !== id
            );
            setListProduct(updateListProduct);
            setSaveListProduct(updateListProduct);

            setUpdateError("delete");
            setTimeout(() => {
              setUpdateError("");
            }, 3000);
          }
        })
        .catch((error) => {});
    }
  };

  //Permet de valider la modification pour qu'elle soit effective en BDD
  const handleValideUpdateProduct = (index) => {
    const productToUpdate = listProduct[index];

    //formatte le tarif
    productToUpdate.price = formatTarif(productToUpdate.price);

    //On vérifie que la quantité en stock n'est pas inférieur à 0
    if (productToUpdate.stockQuantity < 0) {
      productToUpdate.stockQuantity = 0;
    }

    if (
      productToUpdate.name !== "" &&
      productToUpdate.description !== "" &&
      productToUpdate.price !== "" &&
      !isNaN(productToUpdate.price) &&
      productToUpdate.categorie !== "" &&
      productToUpdate.listPicture.length > 0
    ) {
      setLoadingUpdate(true);

      const apiUrl = "http://localhost:8080/api/product/update";
      const requestData = {
        id: productToUpdate.id,
        name: productToUpdate.name,
        description: productToUpdate.description,
        price: productToUpdate.price,
        stockQuantity: productToUpdate.stockQuantity,
        stockInfinite: productToUpdate.stockInfinite,
        categorie: productToUpdate.categorie,
        active: true,
        listPicture: productToUpdate.listPicture,
        showHomePage: productToUpdate.showHomePage,
        optionPersoName: productToUpdate.optionPersoName,
        optionPersoFabric: productToUpdate.optionPersoFabric,
      };
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      axios
        .put(apiUrl, requestData, config)
        .then((response) => {
          //Après modification on disabled tous les éléments
          const finalUpdateProduct = listProduct.map((item, i) => {
            return { ...item, isDisabled: true };
          });

          setListProduct(finalUpdateProduct);
          setSaveListProduct(finalUpdateProduct);
          setLoadingUpdate(false);
          setUpdateError("update");
          setTimeout(() => {
            setUpdateError("");
          }, 3000);
        })
        .catch((error) => {
          setLoadingUpdate(false);
        });
    } else {
      if (isNaN(productToUpdate.price)) {
        setUpdateError("Erreur dans le prix renseigné");
        productToUpdate.price = "";
      } else {
        setUpdateError("Tous les champs du produit doivent être renseignés");
      }
      setTimeout(() => {
        setUpdateError("");
      }, 3000);
    }
  };

  const handleFileChangeUpload = async (event, id) => {
    const dataPicture = event.target.files[0];
    if (dataPicture !== undefined) {
      // Convertir l'image en blob
      const blob = new Blob([dataPicture], { type: dataPicture.type });

      // Créer une URL blob à partir de l'objet Blob
      const imgUrl = URL.createObjectURL(blob);

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

          const updateProduct = listProduct.map((item) => {
            if (item.id === id) {
              let finalListPicture = item.listPicture;
              let finalUrlPicture = item.urlPicture;
              if (finalListPicture.length === 0) {
                finalListPicture = [compressedByteArrayAsArray];
                finalUrlPicture = imgUrl;
              } else {
                finalListPicture.push(compressedByteArrayAsArray);
                finalUrlPicture.push(imgUrl);
              }

              return {
                ...item,
                listPicture: finalListPicture,
                urlPicture: finalUrlPicture,
              };
            } else {
              return item;
            }
          });

          setListProduct(updateProduct);
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

  const handleDeletePicture = (idItem, index) => {
    const finalListProduct = listProduct.map((product, id) => {
      if (idItem === product.id) {
        const finalListPicture = product.listPicture.filter(
          (pic, id) => id !== index
        );
        const finalUrlPicture = product.urlPicture.filter(
          (product, id) => id !== index
        );

        return {
          ...product,
          listPicture: finalListPicture,
          urlPicture: finalUrlPicture,
        };
      } else {
        return { ...product };
      }
    });

    setListProduct(finalListProduct);
  };

  return (
    <>
      {listProduct.length > 0 &&
        !isLoading &&
        listProduct.map((item, index) => (
          <div key={index} className="col-lg-6">
            <div className="list-product">
              {item.isDisabled ? (
                <>
                  <button
                    className="btn btn-disabled btn-dark"
                    onClick={() => handleDisabledFalse(index)}
                    aria-label="Editer"
                  >
                    <BsPen size={25} />
                  </button>
                  <button
                    className="btn btn-delete btn-danger"
                    onClick={() => handleDeleteProduct(item.id)}
                    aria-label="Editer"
                  >
                    <AiOutlineDelete size={25} />
                  </button>
                </>
              ) : (
                <>
                  {loadingUpdate ? (
                    <div className="loading-update-product">
                      <div
                        className="spinner-grow spin-1 text-success m-1"
                        role="status"
                      ></div>
                      <div
                        className="spinner-grow spin-2 text-success m-1"
                        role="status"
                      ></div>
                      <div
                        className="spinner-grow spin-3 text-success m-1"
                        role="status"
                      ></div>
                    </div>
                  ) : (
                    <>
                      <button
                        className="btn btn-disabled btn-danger"
                        onClick={() => handleDisabledTrue()}
                        aria-label="Annuler modification"
                      >
                        <RxCrossCircled size={25} />
                      </button>

                      <button
                        className="btn btn-update btn-success"
                        onClick={() => handleValideUpdateProduct(index)}
                        aria-label="Confirmer modification"
                      >
                        <AiOutlineCheckCircle size={25} />
                      </button>
                    </>
                  )}
                </>
              )}

              <div className="row">
                <div className="col-sm-3">
                  <div className="info-detail">
                    {!item.isDisabled && (
                      <div className="btn btn-primary btn-admin file-upload">
                        <label className="input-perso">
                          <span className="select-img">
                            <BsCloudDownload size={15} /> Image
                          </span>
                          <input
                            type="file"
                            className="input-file"
                            accept="image/jpg, image/jpeg"
                            onChange={(e) => handleFileChangeUpload(e, item.id)}
                          />
                        </label>
                      </div>
                    )}

                    {item.isDisabled ? (
                      <div
                        className="picture"
                        style={{
                          backgroundImage: `url(${item.urlPicture[0]})`,
                        }}
                      ></div>
                    ) : (
                      <>
                        {item.urlPicture.map((picture, key) => (
                          <div
                            key={key}
                            className="picture"
                            style={{
                              backgroundImage: `url(${picture})`,
                            }}
                          >
                            <button
                              className="btn btn-danger"
                              aria-label="supprime image"
                              onClick={() => handleDeletePicture(item.id, key)}
                            >
                              <RxCrossCircled size={25} />
                            </button>
                          </div>
                        ))}
                      </>
                    )}

                    <div className="price-quantity">
                      <div className="price">
                        <input
                          type="text"
                          value={item.price}
                          onChange={(e) =>
                            handleInputChange(index, "price", e.target.value)
                          }
                          disabled={item.isDisabled}
                          required
                        />
                        <span>€</span>
                      </div>
                      <div className="quantity">
                        <button
                          className="btn-quantity"
                          disabled={item.isDisabled}
                          onClick={() => handleQuantityChange(index, "-")}
                        >
                          -
                        </button>
                        <div className="show-quantity">
                          {item.stockInfinite ? (
                            <BiInfinite />
                          ) : (
                            <>{item.stockQuantity}</>
                          )}
                        </div>
                        <button
                          className="btn-quantity"
                          disabled={item.isDisabled}
                          onClick={() => handleQuantityChange(index, "+")}
                        >
                          +
                        </button>
                      </div>
                      <button
                        disabled={item.isDisabled}
                        className="btn btn-dark"
                        onClick={() => handleStockInfini(index)}
                      >
                        <GiCardboardBoxClosed size={20} /> infini
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-sm-9">
                  <div className="info-product">
                    <div className="row mb-2">
                      <div className="categorie">
                        <div className="label">Catégorie:</div>
                        <select
                          name="categorieSelect"
                          disabled={item.isDisabled}
                          onChange={(e) =>
                            handleSelectChange(e.target.value, index)
                          }
                          value={item.categorie.name}
                        >
                          {categories.map((category, i) => (
                            <option key={category.name} value={category.name}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="name">
                        <div className="label">Nom:</div>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            handleInputChange(index, "name", e.target.value)
                          }
                          disabled={item.isDisabled}
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="label">Description:</div>
                      <div className="description">
                        <textarea
                          name="descriptionText"
                          id="descriptionText"
                          cols="30"
                          rows="3"
                          value={item.description}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          disabled={item.isDisabled}
                          required
                        ></textarea>
                      </div>
                    </div>

                    <div className="row">
                      <div className="option-supp">
                        <input
                          type="checkbox"
                          checked={item.optionPersoName}
                          disabled={item.isDisabled}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "optionPersoName",
                              e.target.checked
                            )
                          }
                        />
                        <div>Nom personnalisable</div>
                      </div>

                      <div className="option-supp">
                        <input
                          type="checkbox"
                          checked={item.optionPersoFabric}
                          disabled={item.isDisabled}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "optionPersoFabric",
                              e.target.checked
                            )
                          }
                        />
                        <div>Tissu personnalisable</div>
                      </div>

                      <div className="option-supp">
                        <input
                          type="checkbox"
                          checked={item.showHomePage}
                          disabled={item.isDisabled}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "showHomePage",
                              e.target.checked
                            )
                          }
                        />
                        <div>Afficher sur l'écran d'accueil</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

      {updateError === "delete" && (
        <ShowInfoPopup
          msg="Le produit vient d'être supprimé"
          type="success"
        ></ShowInfoPopup>
      )}

      {updateError === "update" && (
        <ShowInfoPopup
          msg="Le produit vient d'être modifié"
          type="success"
        ></ShowInfoPopup>
      )}

      {updateError !== "" &&
        updateError !== "delete" &&
        updateError !== "update" && (
          <ShowInfoPopup msg={updateError} type="error"></ShowInfoPopup>
        )}
    </>
  );
};

export default ShowListProduct;
