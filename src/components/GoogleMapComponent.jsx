import React, { useEffect, useState } from 'react';
import '../css/components/GoogleMapEmbed.css';

const GoogleMapEmbed = () => {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loaded) {
        setHasError(true);
      }
    }, 10000);

    return () => clearTimeout(timer)
  }, [loaded, retryKey]);

  const handleRetry = () => {
    setLoaded(false);
    setHasError(false);
    setRetryKey(prev => prev + 1);
  }

  return (
    <div className="map-fullwidth-container">
      {!loaded && !hasError && (
        <div className="map-loader">Cargando mapa...</div>
      )}
      {hasError ? (
        <div className="map-error">
          <p>No se pudo cargar el mapa.</p>
          <button onClick={handleRetry}>Reintentar</button>
        </div>
      ) : (
        <iframe
          key={retryKey}
          title="Ubicación consultorio"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3313.377627383078!2d-58.50876818824139!3d-34.67801112903176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcc920d49fb7ab%3A0x66ccd2ae9913b660!2sRivera%20146%2C%20B1751BHB%20Villa%20Madero%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1744735935777!5m2!1ses!2sar"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setLoaded(true)}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
};

export default GoogleMapEmbed;
