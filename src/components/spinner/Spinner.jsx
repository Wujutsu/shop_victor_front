import React from "react";
import "./Spinner.scss";

const Spinner = ({ page = true, fixed = false, point = true }) => {
  return (
    <div className={`${fixed ? "spinner-fixed" : "spinner"}`}>
      {point ? (
        <div
          className={`${page ? "spinner-center-page" : "spinner-center-div"}`}
        >
          <div className="spinner-grow text-success m-1" role="status"></div>
          <div className="spinner-grow text-success m-1" role="status"></div>
          <div className="spinner-grow text-success m-1" role="status"></div>
        </div>
      ) : (
        <div className="box-border">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      )}
    </div>
  );
};

export default Spinner;
