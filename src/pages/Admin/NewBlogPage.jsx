import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import axios from 'axios';
import '../../css/pages/BlogCreatePage.css';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react/dist/iconify.js';

const BlogCreatePage = () => {
  const [title, setTitle] = useState('');
  const [intro, setIntro] = useState('');
  const [category, setCategory] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [contentParagraph, setContentParagraph] = useState('');
  const [contentImages, setContentImages] = useState([]);
  const [extraSections, setExtraSections] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddExtraSection = () => {
    // setExtraSections([...extraSections, { paragraph: '', image: null }]);
    setExtraSections([...extraSections, { paragraph: '', image: [] }]);
  };

  const handleExtraSectionChange = (index, field, value) => {
    const updated = [...extraSections];
    updated[index][field] = value;
    setExtraSections(updated);
  };

  const resetForm = () => {
    setTitle('');
    setIntro('');
    setCategory('');
    setMainImage(null);
    setContentParagraph('');
    setContentImages([]);
    setExtraSections([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('intro', intro);
    formData.append('category', category);
    formData.append('mainImage', mainImage);
    formData.append('contentParagraph', contentParagraph);

    contentImages.forEach(img => formData.append('contentImages', img));

    // Estructura las secciones antes de usarla en formData
    const structuredSections = extraSections.map((section, index) => ({
      paragraph: section.paragraph,
      sectionIndex: index // opcional, para agrupar en el backend
    }));
    formData.append('extraSections', JSON.stringify(structuredSections));

    extraSections.forEach((section, index) => {
      if (section.images && section.images.length > 0) {
        section.images.forEach(img => {
          formData.append(`extraImages-${index}`, img); // Agruparlas por sección
        });
      }
    });

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('https://consultorio-back-xg97.onrender.com/api/blogs', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      toast.success('✅ ¡Publicación creada con éxito!');
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error('❌ Error al crear la publicación. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
};

  
  return (
    <div className="blog-create-container">
      <div>
        <h2>Crear nueva publicación</h2>
        <Link to="/admin/dashboard" className="return-link">
          ← Volver al Panel
        </Link>
      </div>

      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="blog-form">
        <label>Imagen principal:</label>
        <input type="file" accept="image/*" onChange={e => setMainImage(e.target.files[0])} required />
        <input type="text" placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} required />
        <input type="text" placeholder="Intro" value={intro} onChange={e => setIntro(e.target.value)} required />
        <input type="text" placeholder="Categoría" value={category} onChange={e => setCategory(e.target.value)} required />

        <textarea placeholder="Contenido principal" value={contentParagraph} onChange={e => setContentParagraph(e.target.value)} required />

        <label>Imágenes del contenido:</label>
        <input type="file" multiple accept="image/*" onChange={e => setContentImages(Array.from(e.target.files))} />

        <div className="extra-section">
          <h4>Secciones adicionales:</h4>
          {extraSections.map((section, idx) => (
            <div key={idx} className="extra-item">
              <textarea
                placeholder={`Párrafo adicional ${idx + 1}`}
                value={section.paragraph}
                onChange={e => handleExtraSectionChange(idx, 'paragraph', e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                onChange={e => handleExtraSectionChange(idx, 'image', e.target.files[0])}
                // onChange={e => handleExtraSectionChange(idx, 'image', Array.from(e.target.files))}
              />
            </div>
          ))}
          <button type="button" onClick={handleAddExtraSection}><Icon icon="fluent:form-new-20-filled" width="20" height="20" /> Agregar sección</button>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            'Publicando...'
          ) : (
            <>
              <Icon icon="fluent:share-20-filled" width="20" height="20" /> Publicar
            </>
          )}
        </button>
      </form>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default BlogCreatePage;


// const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setMessage('');

  //   const formData = new FormData();
  //   formData.append('title', title);
  //   formData.append('intro', intro);
  //   formData.append('category', category);
  //   formData.append('mainImage', mainImage);
  //   formData.append('contentParagraph', contentParagraph);

  //   contentImages.forEach(img => formData.append('contentImages', img));

  //   // extraSections.forEach(section => {
  //   //   if (section.image) {
  //   //     formData.append('extraImages', section.image);
  //   //   }
  //   // });

  //   // const structuredSections = extraSections.map(section => ({
  //   //   paragraph: section.paragraph
  //   // }));

  //   formData.append('extraSections', JSON.stringify(structuredSections));
  //   extraSections.forEach((section, index) => {
  //     if (section.images && section.images.length > 0) {
  //       section.images.forEach(img => {
  //         formData.append(`extraImages-${index}`, img); // Agruparlas por sección
  //       });
  //     }
  //   });

  //   const structuredSections = extraSections.map((section, index) => ({
  //     paragraph: section.paragraph,
  //     sectionIndex: index // opcional, para agrupar en el backend
  //   }));
  //   formData.append('extraSections', JSON.stringify(structuredSections));


  //   try {
  //     const token = localStorage.getItem('token');
  //     const res = await axios.post('https://consultorio-back-xg97.onrender.com/api/blogs', formData, {
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //       }
  //     });

  //     // setMessage('✅ ¡Publicación creada con éxito!');
  //     toast.success('✅ ¡Publicación creada con éxito!');
  //     resetForm();
  //   } catch (err) {
  //     console.error(err);
  //     // setMessage('❌ Error al crear la publicación. Intenta nuevamente.');
  //     toast.error('❌ Error al crear la publicación. Intenta nuevamente.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  