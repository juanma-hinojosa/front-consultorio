import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import "../../css/pages/EditBlogPage.css"
import { Icon } from '@iconify/react/dist/iconify.js';
const EditBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [intro, setIntro] = useState('');
  const [category, setCategory] = useState('');
  const [contentParagraph, setContentParagraph] = useState('');
  const [extraSections, setExtraSections] = useState([{ paragraph: '', imageUrl: '' }]);

  const [mainImagePreview, setMainImagePreview] = useState('');
  const [mainImageFile, setMainImageFile] = useState(null);

  const [contentImagesPreview, setContentImagesPreview] = useState([]);
  const [contentImagesFiles, setContentImagesFiles] = useState([]);

  const [extraImagesFiles, setExtraImagesFiles] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`https://consultorio-back-xg97.onrender.com/api/blogs/${id}`);
        if (!res.ok) throw new Error('Blog no encontrado');
        const blog = await res.json();

        setTitle(blog.title);
        setIntro(blog.intro);
        setCategory(blog.category);
        setContentParagraph(blog.contentParagraph);
        setMainImagePreview(blog.mainImageUrl);
        setContentImagesPreview(blog.contentImagesUrls || []);
        setExtraSections(blog.extraSections || []);
      } catch (err) {
        console.error('Error al cargar blog:', err);
      }
    };

    fetchBlog();
  }, [id]);

  const handleExtraSectionChange = (index, field, value) => {
    const updated = [...extraSections];
    updated[index][field] = value;
    setExtraSections(updated);
  };

  const addExtraSection = () => {
    setExtraSections([...extraSections, { paragraph: '', imageUrl: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('intro', intro);
    formData.append('category', category);
    formData.append('contentParagraph', contentParagraph);
    formData.append('extraSections', JSON.stringify(extraSections.map((sec) => ({ paragraph: sec.paragraph }))));

    if (mainImageFile) {
      formData.append('mainImage', mainImageFile);
    }

    contentImagesFiles.forEach((file) => {
      formData.append('contentImages', file);
    });

    extraImagesFiles.forEach((file) => {
      formData.append('extraImages', file);
    });

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://consultorio-back-xg97.onrender.com/api/blogs/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Error al actualizar el blog');

      const updated = await res.json();
      console.log('Blog actualizado:', updated);
      toast.success('Blog actualizado correctamente 🎉');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 3000); // espera 1 segundo
    } catch (err) {
      console.error('Error enviando formulario:', err);
      toast.error('Hubo un error al actualizar el blog 😓');
    }
  };

  return (
    <div className="edit-blog">
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginTop:"100px"
      }} >
        <h2>Editar Blog</h2>
        <Link to="/admin/dashboard" className="return-link">
          ← Volver al Panel
        </Link>
      </div>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Título</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Imagen principal</label>
        {mainImagePreview && <img src={mainImagePreview} alt="main" width="200" />}
        <input type="file" accept="image/*" onChange={(e) => setMainImageFile(e.target.files[0])} />

        <label>Introducción</label>
        <textarea value={intro} onChange={(e) => setIntro(e.target.value)} required />

        <label>Categoría</label>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />

        <label>Párrafo principal</label>
        <textarea value={contentParagraph} onChange={(e) => setContentParagraph(e.target.value)} required />



        <label>Imágenes del contenido</label>
        {contentImagesPreview.map((url, i) => (
          <img key={i} src={url} alt={`content-${i}`} width="200" />
        ))}
        <input type="file" accept="image/*" multiple onChange={(e) => setContentImagesFiles(Array.from(e.target.files))} />

        <h3>Secciones extra</h3>
        {extraSections.map((section, index) => (
          <div key={index}>
            <label>Párrafo {index + 1}</label>
            <textarea
              value={section.paragraph}
              onChange={(e) => handleExtraSectionChange(index, 'paragraph', e.target.value)}
            />
            {section.imageUrl && <img src={section.imageUrl} alt={`extra-${index}`} width="200" />}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const files = [...extraImagesFiles];
                files[index] = e.target.files[0];
                setExtraImagesFiles(files);
              }}
            />
          </div>
        ))}
        <button type="button" onClick={addExtraSection}>
          <Icon icon="fluent:form-new-20-filled" width="24" height="24" /> Agregar sección extra
        </button>

        <button type="submit">
          <Icon icon="grommet-icons:document-update" width="24" height="24" />          Actualizar Blog
        </button>
      </form>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default EditBlogPage;
