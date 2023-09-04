import React from "react";
import "./About.scss";
import margaux from "../../../assets/margaux.jpg";
import logo from "../../../assets/logo.webp";

const About = () => {
  return (
    <div className="about">
      <div className="row">
        <div className="col-md-4 ">
          <div className="box-picture">
            <div
              className="picture"
              style={{
                backgroundImage: `url(${margaux})`,
              }}
            ></div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="info">
            <div className="title">À propos de moi:</div>

            <p>
              Bonjour, je m'appelle Margaux, je suis infirmière. <br />
              Étant passionnée par la mode, la décoration, les créations et la
              couture depuis plusieurs années, j'ai eu l'envie de partager mes
              créations avec vous. C'est pourquoi lors d'un apéro entre copines,
              j'ai décidé de créer M&C fabric.
            </p>

            <div className="title mt-4">Pourquoi choisir M&C fabric ?</div>
            <p>
              Les créations sont faites à la main, soignées et avec des
              finitions raffinées. Nos conceptions sont personnalisables grâce à
              leurs tissus, formes, finitions et broderies. Elles sont uniques,
              à votre image et vous seront très utiles au quotidien. La majeure
              partie de nos tissus est certifiée Oeko-tex, ce qui protège
              l’environnement et notre santé. La livraison payante s’effectue
              via Colissimo ou Mondial Relay. Le retrait en main propre dans
              l’agglomération lyonnaise est quant à lui gratuit (contactez nous
              pour convenir d’un lieu de rendez-vous). Nous sommes disponibles
              et à votre écoute pour toutes demandes, les créations sur mesure,
              les reprises couture.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;