// src/components/Flyers/HeroFlyer.jsx
import React from "react";
import "../css/components/HeroFlyerComponent.css";
// import HeaderTitleComponent from "./HeaderTitleComponent";

const HeroFlyer = ({ flyer }) => {
  if (!flyer) return null;
  const formatDateLocal = (isoDate) => {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("T")[0].split("-");
    return `${day}-${month}-${year}`;
  };

  return (
    <section className="hero-flyer poppins-regular" aria-label={`Flyer destacado: ${flyer.titulo}`}>
       <img
        src={flyer.image || '/default-flyer.jpg'}
        alt="Flyer"
        className="hero-flyer-image"
      />
      {/* <div
        className="hero-flyer-image"
        style={{
          backgroundImage: `linear-gradient(rgba(214, 217, 219, 0.7), rgba(214, 217, 219, 0.8)),url(${flyer.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      > */}
        <div className="hero-flyer-text">
          <h1>{flyer.title}</h1>
          <p>{flyer.paragraph}</p>
          <p className="expiration">
            Válido hasta:  {formatDateLocal(flyer.expirationDate)}
            {/* {new Date(flyer.expirationDate).toLocaleDateString()} */}
           
          </p>
        </div>

    </section>
  );
};

export default HeroFlyer;
