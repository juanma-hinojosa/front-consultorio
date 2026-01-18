import React, { useEffect, useState } from "react";

const BlogPendingApproval = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/blogs/pendientes`, {
      // headers: {
      //   Authorization: `Bearer ${localStorage.getItem("token")}`,
      // },
      credentials: 'include',

    })
      .then(async (res) => {
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Error ${res.status}: ${errText}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setBlogs(data);
        } else {
          throw new Error("La respuesta no es un array");
        }
      })
      .catch((err) => {
        console.error("Error al obtener blogs:", err);
        setError("No se pudieron cargar los blogs pendientes.");
      });
  }, []);

  const aprobarBlog = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/aprobar/${id}`, {
      method: "PUT",
      // headers: {
      //   Authorization: `Bearer ${localStorage.getItem("token")}`,
      // },
      credentials: 'include',

    });
    setBlogs((prev) => prev.filter((b) => b._id !== id));
  };

  return (
    <div className="pending-blogs poppins-light">
      <h3>Blogs Pendientes de Aprobación</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {blogs.length === 0 ? (
        <p>No hay blogs pendientes.</p>
      ) : (
        blogs.map((blog) => (
          <div key={blog._id} className="blog-card">
            <h4>{blog.titulo}</h4>
            <p>{blog.introduccion}</p>
            <button onClick={() => aprobarBlog(blog._id)}>Aprobar</button>
          </div>
        ))
      )}
    </div>
  );
};

export default BlogPendingApproval;
