import React, { useState } from "react";
import { toast } from "react-toastify";

const BlogCreate = () => {
  const [tema, setTema] = useState("");
  const [titulo, setTitulo] = useState("");
  const [intro, setIntro] = useState("");
  const [imagenPrincipal, setImagenPrincipal] = useState(null);
  const [parrafos, setParrafos] = useState([{ texto: "", imagenes: [] }]);

  const handleParrafoChange = (index, value) => {
    const nuevosParrafos = [...parrafos];
    nuevosParrafos[index].texto = value;
    setParrafos(nuevosParrafos);
  };
 
  const handleImagenChange = (index, files) => {
    const nuevosParrafos = [...parrafos];
    nuevosParrafos[index].imagenes = files;
    setParrafos(nuevosParrafos);
  };

  const agregarParrafo = () => {
    setParrafos([...parrafos, { texto: "", imagenes: [] }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("tema", tema);
    formData.append("titulo", titulo);
    formData.append("intro", intro);

    if (imagenPrincipal) {
      formData.append("imagenPrincipal", imagenPrincipal);
    }

    parrafos.forEach((parrafo, idx) => {
      // formData.append(`parrafos[${idx}][texto]`, parrafo.texto);
      formData.append(`parrafos[${idx}][texto]`, parrafo.texto || "");
      for (let i = 0; i < parrafo.imagenes.length; i++) {
        formData.append(`parrafos[${idx}][imagenes]`, parrafo.imagenes[i]);
      }

    });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Blog creado con éxito (esperando aprobación)");
        setTema("");
        setTitulo("");
        setIntro("");
        setImagenPrincipal(null);
        setParrafos([{ texto: "", imagenes: [] }]);
      } else {
        toast.error(data.message || "Error al crear blog");
      }
    } catch (error) {
      toast.error("Error del servidor");
    }

    
  };

  return (
    <section className="crear-paciente">
      <h3 className='poppins-regular'>Nuevo Blog</h3>
      <section className="ui-form-container">
        <form className="ui-form poppins-light" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Tema"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            required
            className="ui-input"
          />
          <input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="ui-input"
          />
          <textarea
            placeholder="Introducción"
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            required
            className="ui-input"
          />

          <label>Imagen principal:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagenPrincipal(e.target.files[0])}
          />

          {parrafos.map((parrafo, index) => (
            <div key={index} className="parrafo">
              <textarea
                placeholder={`Párrafo ${index + 1}`}
                value={parrafo.texto}
                onChange={(e) => handleParrafoChange(index, e.target.value)}
                className="ui-textarea"
              />
              <input
                type="file"
                multiple
                onChange={(e) => handleImagenChange(index, e.target.files)}
              />
            </div>
          ))}

          <button type="button" onClick={agregarParrafo}>
            + Agregar Párrafo
          </button>
          <button type="submit">Crear</button>
        </form>
      </section>
    </section>
  );
};

export default BlogCreate;
