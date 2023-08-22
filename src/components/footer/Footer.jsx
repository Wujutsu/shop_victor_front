import React from "react";
import "./Footer.scss";
import { BsFacebook, BsInstagram } from "react-icons/bs";
import { Link } from "react-router-dom";

export const Footer = () => {
  const copyrightYear = new Date().getFullYear();

  return (
    <div className="footer">
      <small> &copy; {copyrightYear} M&C Fabric</small>
      <div className="social-links">
        <Link to="https://www.instagram.com/mc.fabric/" target="_blank">
          <BsInstagram color="white" size={30} />
        </Link>
        <Link
          to="https://www.facebook.com/people/MC-fabric/100095020135734/?mibextid=LQQJ4d"
          target="_blank"
        >
          <BsFacebook color="white" size={30} />
        </Link>
      </div>
    </div>
  );
};

export default Footer;
