import React from "react";
import "./Spinner.scss";

const Spinner = ({ page = true, fixed = false }) => {
  return (
    <div className={`${fixed ? "spinner-fixed" : "spinner"}`}>
      <div className={`${page ? "spinner-center-page" : "spinner-center-div"}`}>
        <div className="spinner-grow text-success m-1" role="status"></div>
        <div className="spinner-grow text-success m-1" role="status"></div>
        <div className="spinner-grow text-success m-1" role="status"></div>
      </div>
    </div>
  );
};

export default Spinner;
