import React, { useContext, useState } from "react";
import "./AddProduct.scss";
import { BsCloudDownload } from "react-icons/bs";
import { RxCrossCircled } from "react-icons/rx";
import { AiOutlineCheckCircle } from "react-icons/ai";
import axios from "axios";
import { UserContext } from "../../../../contexts/UserContext";
import { convertDataImg, formatTarif } from "../../../../utils/functionUtils";
import ShowInfoPopup from "../../../../components/showInfoPopup/ShowInfoPopup";
import { BiInfinite } from "react-icons/bi";
import { GiCardboardBoxClosed } from "react-icons/gi";
import Compressor from "compressorjs";

const AddProduct = ({
  categories,
  showModalNewProduct,
  setShowModalNewProduct,
  listProduct,
  setListProduct,
  setSaveListProduct,
}) => {
  const { token } = useContext(UserContext);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: 0,
    stockInfinite: false,
    categorie: { id: "", name: "" },
    listPicture: [],
    active: true,
    optionPersoName: false,
    optionPersoFabric: false,
    showHomePage: false,
  });
  const [img, setImg] = useState("");
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [successAdd, setSuccessAdd] = useState("0");

  //Sélectionne une image et la convertie en byte[] et renvoie un lien pour afficher l'image
  const handleFileChangeUpload = async (event) => {
    const dataPicture = event.target.files[0];
    if (dataPicture !== undefined) {
      // Convertir l'image en blob
      const blob = new Blob([dataPicture], { type: dataPicture.type });

      // Créer une URL blob à partir de l'objet Blob
      const imgUrl = URL.createObjectURL(blob);
      setImg(imgUrl);

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

          const updateProduct = { ...newProduct };
          updateProduct.listPicture = [compressedByteArrayAsArray];
          setNewProduct(updateProduct);
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

  //Permet de mettre à jour les champs
  const handleAddInputChange = (field, value) => {
    const updatedProduct = { ...newProduct };

    if (field === "categorie") {
      const recupInfoCategory = categories.find((item) => item.name === value);

      if (recupInfoCategory !== undefined) {
        updatedProduct[field] = recupInfoCategory;
      }
    } else if (field === "stockQuantity") {
      let quantityTemp = parseInt(updatedProduct[field]);

      updatedProduct.stockInfinite = false;

      updatedProduct[field] =
        value === "+" ? quantityTemp + 1 : quantityTemp - 1;
      if (quantityTemp < 0) {
        updatedProduct[field] = 0;
      }
    } else {
      updatedProduct[field] = value;
    }

    setNewProduct(updatedProduct);
  };

  //Permet de mettre un stock en infini
  const handleStockInfini = (index) => {
    const updatedProduct = { ...newProduct };

    updatedProduct.stockInfinite = true;
    updatedProduct.stockQuantity = 1;

    setNewProduct(updatedProduct);
  };

  //Permet d'annuler l'ajout d'un produit
  const handleCancleAddProduct = () => {
    setShowModalNewProduct(false);
    setImg("");
    setNewProduct({
      name: "",
      description: "",
      price: "",
      stockQuantity: 0,
      stockInfinite: false,
      categorie: { id: "", name: "" },
      listPicture: [],
      active: true,
      optionPersoName: false,
      optionPersoFabric: false,
      showHomePage: false,
    });
  };

  //Permet d'enregistrer un produit
  const handleAddProduct = () => {
    const productToAdd = newProduct;

    //formatte le tarif
    productToAdd.price = formatTarif(productToAdd.price);

    //On vérifie que la quantité en stock n'est pas inférieur à 0
    if (productToAdd.stockQuantity < 0) {
      productToAdd.stockQuantity = 0;
    }

    if (
      productToAdd.name !== "" &&
      productToAdd.description !== "" &&
      productToAdd.price !== "" &&
      !isNaN(productToAdd.price) &&
      productToAdd.categorie !== ""
    ) {
      setLoadingUpdate(true);

      const apiUrl = "http://localhost:8080/api/product/add";
      const requestData = {
        name: productToAdd.name,
        description: productToAdd.description,
        price: productToAdd.price,
        stockQuantity: productToAdd.stockQuantity,
        stockInfinite: productToAdd.stockInfinite,
        categorie: productToAdd.categorie,
        listPicture: productToAdd.listPicture,
        active: productToAdd.active,
        showHomePage: productToAdd.showHomePage,
        optionPersoName: productToAdd.optionPersoName,
        optionPersoFabric: productToAdd.optionPersoFabric,
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
          const updateListProduct = [...listProduct];
          const dataNewProduct = {
            ...response.data,
            urlPicture: convertDataImg(response.data.listPicture[0]),
            price: formatTarif(response.data.price),
            isDisabled: true,
          };

          updateListProduct.unshift(dataNewProduct);

          setListProduct(updateListProduct);
          setSaveListProduct(updateListProduct);
          handleCancleAddProduct();
          setLoadingUpdate(false);
          setSuccessAdd("ok");
          setTimeout(() => {
            setSuccessAdd("0");
          }, 3000);
        })
        .catch((error) => {
          setLoadingUpdate(false);
        });
    } else {
      if (isNaN(productToAdd.price)) {
        setSuccessAdd("2");
        productToAdd.price = "";
      } else {
        setSuccessAdd("1");
      }
      setTimeout(() => {
        setSuccessAdd("0");
      }, 3000);
    }
  };

  return (
    <>
      {showModalNewProduct && (
        <div className="col-lg-6">
          <div className="list-product">
            <div className="row">
              <div className="col-sm-3">
                <div className="info-detail">
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
                  <div className="save-product">
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
                        {newProduct.name !== "" &&
                          newProduct.description !== "" &&
                          newProduct.price !== "" &&
                          newProduct.categorie.name !== "" &&
                          newProduct.listPicture.length > 0 && (
                            <button
                              className="btn btn-success"
                              aria-label="Confirmer modification"
                              onClick={() => handleAddProduct()}
                            >
                              <AiOutlineCheckCircle
                                className="check"
                                size={25}
                              />
                            </button>
                          )}

                        <button
                          className="btn btn-danger"
                          aria-label="Annuler modification"
                          onClick={() => handleCancleAddProduct()}
                        >
                          <RxCrossCircled size={25} />
                        </button>
                      </>
                    )}
                  </div>

                  {img !== "" ? (
                    <div className="box-img">
                      <img className="img-fluid" src={img} alt={`item add`} />
                    </div>
                  ) : (
                    <div className="img-wait"> </div>
                  )}
                  <div className="price-quantity">
                    <div className="price">
                      <input
                        type="text"
                        value={newProduct.price}
                        onChange={(e) =>
                          handleAddInputChange("price", e.target.value)
                        }
                        autoComplete="off"
                        required
                      />
                      <span>€</span>
                    </div>
                    <div className="quantity">
                      <button
                        className="btn-quantity"
                        onClick={() =>
                          handleAddInputChange("stockQuantity", "-")
                        }
                      >
                        -
                      </button>
                      <div className="show-quantity">
                        {newProduct.stockInfinite ? (
                          <BiInfinite />
                        ) : (
                          <>{newProduct.stockQuantity}</>
                        )}
                      </div>
                      <button
                        className="btn-quantity"
                        onClick={() =>
                          handleAddInputChange("stockQuantity", "+")
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="btn btn-dark btn-stock-infinite"
                      onClick={() => handleStockInfini()}
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
                        onChange={(e) =>
                          handleAddInputChange("categorie", e.target.value)
                        }
                        autoComplete="off"
                        value={newProduct.categorie.name}
                        required
                      >
                        <option value=""></option>
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
                        value={newProduct.name}
                        onChange={(e) =>
                          handleAddInputChange("name", e.target.value)
                        }
                        autoComplete="off"
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
                        value={newProduct.description}
                        autoComplete="off"
                        onChange={(e) =>
                          handleAddInputChange("description", e.target.value)
                        }
                        required
                      ></textarea>
                    </div>
                  </div>

                  <div className="row">
                    <div className="option-supp">
                      <input
                        type="checkbox"
                        checked={newProduct.optionPersoName}
                        onChange={(e) =>
                          handleAddInputChange(
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
                        checked={newProduct.optionPersoFabric}
                        onChange={(e) =>
                          handleAddInputChange(
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
                        checked={newProduct.showHomePage}
                        onChange={(e) =>
                          handleAddInputChange("showHomePage", e.target.checked)
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
      )}

      {successAdd === "ok" && (
        <ShowInfoPopup
          msg="Le produit vient d'être ajouté"
          type="success"
        ></ShowInfoPopup>
      )}

      {successAdd === "1" && (
        <ShowInfoPopup
          msg="Tous les champs du produit doivent être renseignés"
          type="error"
        ></ShowInfoPopup>
      )}

      {successAdd === "2" && (
        <ShowInfoPopup
          msg="Erreur dans le prix renseigné"
          type="error"
        ></ShowInfoPopup>
      )}
    </>
  );
};

export default AddProduct;
