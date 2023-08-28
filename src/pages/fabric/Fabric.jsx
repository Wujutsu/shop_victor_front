import React, { useContext, useEffect, useState } from "react";
import "./Fabric.scss";
import { UserContext } from "../../contexts/UserContext";
import { convertDataImg } from "../../utils/functionUtils";
import axios from "axios";
import Spinner from "../../components/spinner/Spinner";

const Fabric = () => {
  const { token } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [listFabric, setListFabric] = useState([]);

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

  return (
    <div className="page-fabric">
      <div className="title-page">Nos tissus</div>

      {isLoading ? (
        <Spinner page={true} />
      ) : (
        <div className="row">
          {listFabric.map((item, index) => (
            <div key={index} className="col-lg-3 col-md-4 col-sm-4 col-6">
              <div className="box-fabric">
                <div
                  className="picture"
                  style={{ backgroundImage: `url(${item.picture})` }}
                ></div>
                <div className="title">{item.name}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Fabric;
