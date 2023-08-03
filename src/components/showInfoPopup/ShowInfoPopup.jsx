import React, { useEffect, useState } from "react";
import "./ShowInfoPopup.scss";

const ShowInfoPopup = ({ msg, type }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [hexColor, setHexColor] = useState("");

  useEffect(() => {
    switch (type) {
      case "success":
        setHexColor("#006400");
        break;
      case "error":
        setHexColor("#8B0000");
        break;
      default:
        setHexColor("#191414");
        break;
    }
  }, [type]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div>
      {isVisible && (
        <div
          className="popup"
          style={{ backgroundColor: hexColor, color: "white" }}
        >
          {msg}
        </div>
      )}
    </div>
  );
};

export default ShowInfoPopup;
