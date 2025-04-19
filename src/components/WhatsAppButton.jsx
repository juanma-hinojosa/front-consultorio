import React from 'react';
import { Icon } from '@iconify/react';
import '../css/components/WhatsappButton.css';

const WhatsappButton = () => {
  const phoneNumber = '5491127706352'; // reemplaza con tu número de WhatsApp
  const message = 'Hola! Quisiera hacer una consulta.'; // mensaje opcional

  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="wpp-button">
      <Icon icon="ic:baseline-whatsapp" width="32" height="32" />
    </a>
  );
};

export default WhatsappButton;
