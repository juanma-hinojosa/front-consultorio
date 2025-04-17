import React, { useEffect, useState } from 'react';
import "../css/components/FlyerPopup.css";

const FlyerPopup = () => {
  const [flyer, setFlyer] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mostrar el popup solo si no fue mostrado en esta sesión
    const alreadyShown = sessionStorage.getItem('flyerShown');
    if (alreadyShown) return;

    const fetchFlyer = async () => {
      try {
        const response = await fetch('https://consultorio-back-xg97.onrender.com/api/flyers');
        if (response.ok) {
          const data = await response.json();
          setFlyer(data);
          setIsVisible(true);
          sessionStorage.setItem('flyerShown', 'true'); // ✅ solo para esta sesión
        }
      } catch (error) {
        console.error("Error cargando el flyer:", error);
      }
    };

    fetchFlyer();
  }, []);

  if (!isVisible || !flyer) return null;

  const closePopup = () => {
    setIsVisible(false);
  };

  return (
    <div className="flyer-popup">
      <div className="flyer-content">
        <img src={flyer.imageUrl} alt="Flyer" />
        <h3>{flyer.text}</h3>
        <p>{flyer.paragraph}</p>
        <button onClick={closePopup}>Cerrar</button>
      </div>
    </div>
  );
};

export default FlyerPopup;
