// src/api/api.js
export const API_URL = import.meta.env.VITE_API_URL;

export const postData = async (endpoint, data) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    credentials: 'include', // IMPORTANTE para enviar la cookie con el token
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  return res.json();
};
