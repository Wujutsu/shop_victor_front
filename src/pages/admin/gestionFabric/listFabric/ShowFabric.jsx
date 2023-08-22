import React from "react";
import "./ShowFabric.scss";
import { AiOutlineDelete } from "react-icons/ai";

const ShowFabric = ({ fabric, handleDeleteFabric }) => {
  return (
    <div className="col-lg-2 col-md-3 col-sm-4 col-6">
      <div className="fabric">
        <button
          className="btn btn-danger btn-delete"
          onClick={() => handleDeleteFabric(fabric.id)}
        >
          <div>
            <AiOutlineDelete size={25} />
          </div>
        </button>
        <div
          className="picture"
          style={{ backgroundImage: `url(${fabric.picture})` }}
        ></div>
        <div className="name">{fabric.name}</div>
      </div>
    </div>
  );
};

export default ShowFabric;
