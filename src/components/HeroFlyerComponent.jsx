import React, { useEffect, useState } from 'react';
import '../css/components/HeroFlyerComponent.css';

// const HeroFlyerComponent = () => {
//   const [flyer, setFlyer] = useState(null);

//   useEffect(() => {
//     const fetchFlyer = async () => {
//       try {
//         const res = await fetch('https://consultorio-back-xg97.onrender.com/api/flyers');
//         if (res.ok) {
//           const data = await res.json();
//           setFlyer(data);
//         }
//       } catch (error) {
//         console.error('Error al cargar el flyer:', error);
//       }
//     };
//     fetchFlyer();
//   }, []);

//   if (!flyer) return null; // 👈🏼 Esto evita que se renderice si aún no hay datos

//   return (
//     <section className="hero-flyer">
//       <img
//         src={flyer.imageUrl || '/default-flyer.jpg'}
//         alt="Flyer"
//         className="hero-flyer-image"
//       />
//       <div className="hero-flyer-text">
//         <h1>{flyer.text || 'Bienvenido a nuestro Blog'}</h1>
//         <p>{flyer.paragraph || 'Explorá nuestras últimas publicaciones sobre salud y bienestar.'}</p>
//       </div>
//     </section>
//   );
// };

// export default HeroFlyerComponent;

const HeroFlyerComponent = ({ flyer }) => {
  if (!flyer) return null;

  return (
    <section className="hero-flyer">
      <img
        src={flyer.imageUrl || '/default-flyer.jpg'}
        alt="Flyer"
        className="hero-flyer-image"
      />
      <div className="hero-flyer-text">
        <h1>{flyer.text || 'Bienvenido a nuestro Blog'}</h1>
        <p>{flyer.paragraph || 'Explorá nuestras últimas publicaciones sobre salud y bienestar.'}</p>
      </div>
    </section>
  );
};

export default HeroFlyerComponent;
