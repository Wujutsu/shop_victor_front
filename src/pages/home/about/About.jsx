import React from "react";
import "./About.scss";
import pictureMCFabric from "../../../assets/pictureMCFabric.png";

const About = () => {
  return (
    <div className="about">
      <div className="row">
        <div className="col-lg-4 col-md-5">
          <div className="box-picture">
            <div
              className="picture"
              style={{
                backgroundImage: `url(${pictureMCFabric})`,
              }}
            ></div>
          </div>
        </div>
        <div className="col-lg-8 col-md-7">
          <div className="info">
            <div className="title">À propos de moi:</div>

            <div className="text">
              Bonjour, je m'appelle Margaux, je suis infirmière. Étant
              passionnée par la mode, la décoration, les créations et la couture
              depuis plusieurs années, j'ai eu l'envie de partager mes créations
              avec vous.
              <div className="space-text">
                C'est pourquoi lors d'un apéro entre copines, j'ai décidé de
                créer M&C fabric.
              </div>
            </div>

            <div className="title mt-5">Pourquoi choisir M&C fabric ?</div>
            <div className="text">
              Les créations sont faites à la main, soignées et avec des
              finitions raffinées. Nos conceptions sont personnalisables grâce à
              leurs tissus, formes, finitions et broderies. Elles sont uniques,
              à votre image et vous seront très utiles au quotidien.
              <div className="space-text">
                La majeure partie de nos tissus est certifiée Oeko-tex, ce qui
                protège l’environnement et notre santé.
              </div>
              <div className="space-text">
                La livraison payante s’effectue via Colissimo ou Mondial Relay.
                Le retrait en main propre dans l’agglomération lyonnaise est
                quant à lui gratuit (contactez nous pour convenir d’un lieu de
                rendez-vous). Nous sommes disponibles et à votre écoute pour
                toutes demandes, les créations sur mesure, les reprises couture.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
