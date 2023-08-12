import React, { useState } from "react";
import "./AddProduct.scss";
import { BsCloudDownload } from "react-icons/bs";
import { RxCrossCircled } from "react-icons/rx";
import { AiOutlineCheckCircle } from "react-icons/ai";

const AddProduct = ({ categories, showModalNewProduct }) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: 0,
    categorie: { id: "", name: "" },
    listPicture: [],
    active: true,
  });
  const [img, setImg] = useState("");

  //Sélectionne une image et la convertie en byte[]
  const handleFileChangeUpload = (event) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const fileData = event.target.result;
      const byteArray = new Uint8Array(fileData);
      const byteArrayAsArray = Array.from(byteArray);

      // Convertir l'array buffer en un objet Blob
      const blob = new Blob([byteArray], { type: "image/png" });
      // Créer une URL blob à partir de l'objet Blob
      const imgUrl = URL.createObjectURL(blob);
      setImg(imgUrl);

      const updateProduct = { ...newProduct };
      updateProduct.listPicture = [byteArrayAsArray];
      setNewProduct(updateProduct);
    };

    const dataPicture = event.target.files[0];
    if (dataPicture !== undefined) {
      reader.readAsArrayBuffer(event.target.files[0]);
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

      updatedProduct[field] =
        value === "+" ? quantityTemp + 1 : quantityTemp - 1;
      if (quantityTemp < 0) {
        updatedProduct[field] = 0;
      }
    } else {
      updatedProduct[field] = value;
    }

    console.log("updatedProduct => ", updatedProduct);
    setNewProduct(updatedProduct);
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
                        <BsCloudDownload size={18} /> Image
                      </span>
                      <input
                        type="file"
                        className="input-file"
                        accept="image/*"
                        onChange={(e) => handleFileChangeUpload(e)}
                      />
                    </label>
                  </div>

                  <div className="save-product">
                    <button
                      className="btn btn-success"
                      aria-label="Confirmer modification"
                    >
                      <AiOutlineCheckCircle className="check" size={25} />
                    </button>
                    <button
                      className="btn btn-danger"
                      aria-label="Annuler modification"
                    >
                      <RxCrossCircled size={25} />
                    </button>
                  </div>
                  {img !== "" && (
                    <img className="img-fluid" src={img} alt={`item add`} />
                  )}

                  <div className="price-quantity">
                    <div className="price">
                      <input
                        type="text"
                        value={newProduct.price}
                        onChange={(e) =>
                          handleAddInputChange("price", e.target.value)
                        }
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
                      <input
                        className="show-quantity"
                        type="text"
                        value={newProduct.stockQuantity}
                        onChange={(e) =>
                          handleAddInputChange("stockQuantity", e.target.value)
                        }
                        autoComplete="off"
                      />
                      <button
                        className="btn-quantity"
                        onClick={() =>
                          handleAddInputChange("stockQuantity", "+")
                        }
                      >
                        +
                      </button>
                    </div>
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
                        value={newProduct.categorie.name}
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
                        onChange={(e) =>
                          handleAddInputChange("description", e.target.value)
                        }
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddProduct;
