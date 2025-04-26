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
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6562.153212210932!2d-58.506162!3d-34.678016!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcc9006c2057df%3A0x695ddfa816785142!2sConsultorio%20m%C3%A9dico%20integral%20San%20Marcos!5e0!3m2!1ses!2sar!4v1745439969864!5m2!1ses!2sar"
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
