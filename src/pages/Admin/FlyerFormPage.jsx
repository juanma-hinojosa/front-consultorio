import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react';
import "../../css/pages/FlyerFormPage.css"
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';
const FlyerFormPage = () => {
    const [image, setImage] = useState(null);
    const [text, setText] = useState('');
    const [paragraph, setParagraph] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [message, setMessage] = useState('');

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     const formData = new FormData();
    //     formData.append('image', image);
    //     formData.append('text', text);
    //     formData.append('paragraph', paragraph);
    //     formData.append('expirationDate', expirationDate);

    //     const token = localStorage.getItem('token');
    //     for (let [key, value] of formData.entries()) {
    //         console.log(`${key}:`, value);
    //     }

    //     const res = await fetch('http://localhost:5000/api/flyers', {
    //         method: 'POST',
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         },
    //         body: formData,
    //     });

    //     if (res.ok) {
    //         toast.success('Flyer creado exitosamente 🎉');
    //         // setMessage('Flyer creado exitosamente');
    //         setText('');
    //         setParagraph('');
    //         setExpirationDate('');
    //         setImage(null);
    //     } else {
    //         setMessage('Error al crear flyer');
    //     }
    // };
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('image', image);
        formData.append('text', text);
        formData.append('paragraph', paragraph);
        formData.append('expirationDate', expirationDate);
    
        const token = localStorage.getItem('token');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
    
        try {
            const res = await fetch('https://consultorio-back-xg97.onrender.com/api/flyers', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
    
            if (res.ok) {
                toast.success('Flyer creado exitosamente 🎉');
                setText('');
                setParagraph('');
                setExpirationDate('');
                setImage(null);
            } else {
                throw new Error('Error al crear flyer');
            }
        } catch (err) {
            toast.error('Hubo un error al crear el flyer 😓');
        }
    };
    
    return (
        <>
            
            <div className="flyer-form-container">
            <div style={{
                marginTop:"100px"
            }}>
                <h2>Crear nuevo Flyer</h2>
                <Link to="/admin/dashboard" className="return-link">
                    ← Volver al Panel
                </Link>
            </div>                {message && <p>{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Imagen:</label>
                        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />
                    </div>
                    <div>
                        <label>Título / Texto:</label>
                        <input type="text" value={text} onChange={(e) => setText(e.target.value)} required />
                    </div>
                    <div>
                        <label>Párrafo:</label>
                        <textarea value={paragraph} onChange={(e) => setParagraph(e.target.value)} required />
                    </div>
                    <div>
                        <label>Fecha de expiración:</label>
                        <input type="date" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} required />
                    </div>
                    <button type="submit"><Icon icon="fluent:share-20-filled" width="20" height="20" /> Crear Flyer</button>
                </form>
            </div>
            <ToastContainer position="top-center" autoClose={3000} />

        </>

    );
};

export default FlyerFormPage;
