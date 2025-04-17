// src/pages/Admin/EditFlyerPage.jsx
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../../css/pages/EditFlyerPage.css';
import { Icon } from '@iconify/react/dist/iconify.js';


const EditFlyerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flyerData, setFlyerData] = useState({
    text: '',
    paragraph: '',
    expirationDate: '',
  });
  const [image, setImage] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchFlyer = async () => {
      try {
        const res = await fetch(`https://consultorio-back-xg97.onrender.com/api/flyers/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const flyer = data.find((f) => f._id === id);
        if (flyer) {
          setFlyerData({
            text: flyer.text,
            paragraph: flyer.paragraph,
            expirationDate: flyer.expirationDate.slice(0, 10),
          });
        }
      } catch (err) {
        console.error('Error al cargar flyer', err);
      }
    };

    fetchFlyer();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('text', flyerData.text);
    formData.append('paragraph', flyerData.paragraph);
    formData.append('expirationDate', flyerData.expirationDate);
    if (image) {
      formData.append('image', image);
    }

    try {
      const res = await fetch(`https://consultorio-back-xg97.onrender.com/api/flyers/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        toast.success('Flyer actualizado correctamente ✅');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 3000); // espera 1 segundo
      } else {
        const errData = await res.json();
        // alert(errData.message || 'Error al actualizar flyer');
        toast.error(errData.message || 'Error al actualizar flyer ❌');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error del servidor al actualizar flyer ❌');
    }
  };

  return (
    <>
      <div className="edit-flyer-container">
        <div
          style={{ marginTop: "110px" }}
        >
          <h2>Editar Flyer</h2>
          <Link to="/admin/dashboard" className="return-link">
            ← Volver al Panel
          </Link>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={flyerData.text}
            onChange={(e) => setFlyerData({ ...flyerData, text: e.target.value })}
            placeholder="Título"
          />
          <textarea
            value={flyerData.paragraph}
            onChange={(e) => setFlyerData({ ...flyerData, paragraph: e.target.value })}
            placeholder="Descripción"
          />
          <input
            type="date"
            value={flyerData.expirationDate}
            onChange={(e) => setFlyerData({ ...flyerData, expirationDate: e.target.value })}
          />
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          <button type="submit">
            <Icon icon="grommet-icons:document-update" width="24" height="24" />
            Actualizar Flyer</button>
        </form>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />

    </>

  );
};

export default EditFlyerPage;
