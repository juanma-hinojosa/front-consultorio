import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const BlogEdit = ({ blogId }) => {
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const cargarBlog = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/${blogId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error("Blog no encontrado");
        }

        const data = await res.json();
        setBlog({ ...data, intro: data.introduccion });
      } catch (error) {
        console.error(error);
        toast.error("No se pudo cargar el blog");
      }
    };

    cargarBlog();
  }, [blogId]);

  const handleChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const handleParrafoChange = (index, value) => {
    const nuevosParrafos = [...blog.parrafos];
    nuevosParrafos[index].texto = value;
    setBlog({ ...blog, parrafos: nuevosParrafos });
  };

  const handleImagenPrincipalChange = (e) => {
    setBlog({ ...blog, nuevaImagenPrincipal: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmado = window.confirm("¿Estás seguro de que deseas actualizar este blog?");
    if (!confirmado) return;

    const formData = new FormData();
    formData.append("tema", blog.tema);
    formData.append("titulo", blog.titulo);
    formData.append("introduccion", blog.intro);
    formData.append("parrafos", JSON.stringify(blog.parrafos));

    if (blog.nuevaImagenPrincipal) {
      formData.append("imagenPrincipal", blog.nuevaImagenPrincipal);
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/${blogId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Blog actualizado");
      } else {
        toast.error(data.message || "Error al actualizar");
      }
    } catch (error) {
      toast.error("Error al actualizar el blog");
    }
  };

  if (!blog) return <p>Cargando...</p>;

  return (
    <section className="ui-form-container">
      <form onSubmit={handleSubmit} className="ui-form poppins-regular">
        <h3>Editar Blog</h3>

        <input
          name="tema"
          value={blog.tema}
          onChange={handleChange}
          placeholder="Tema"
          className="ui-input"
        />
        <input
          name="titulo"
          value={blog.titulo}
          onChange={handleChange}
          placeholder="Título"
          className="ui-input"
        />
        <textarea
          name="intro"
          value={blog.intro}
          onChange={handleChange}
          placeholder="Introducción"
          className="ui-textarea"
        />

        {blog.imagenPrincipal && (
          <div>
            <p>Imagen principal actual:</p>
            <img src={blog.imagenPrincipal} alt="Imagen principal" width="200" />
          </div>
        )}
        <label>Reemplazar imagen principal:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImagenPrincipalChange}
        />

        <h4>Párrafos:</h4>
        {blog.parrafos.map((parrafo, index) => (
          <div key={index} className="parrafo-section">
            <textarea
              value={parrafo.texto}
              onChange={(e) => handleParrafoChange(index, e.target.value)}
              placeholder={`Texto del párrafo ${index + 1}`}
              className="ui-textarea"
            />
            {parrafo.imagenes?.length > 0 && (
              <div className="imagenes-preview">
                {parrafo.imagenes.map((img, i) => (
                  <img
                    key={i}
                    src={img.startsWith("http") ? img : `${import.meta.env.VITE_API_URL}/${img}`}
                    alt={`Párrafo ${index + 1} imagen ${i + 1}`}
                    style={{ width: 100 }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        <button type="submit">Actualizar</button>
      </form>
    </section>
  );
};

export default BlogEdit;
