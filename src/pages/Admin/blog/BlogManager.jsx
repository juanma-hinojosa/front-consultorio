import React, { useState } from "react";
import BlogList from "./BlogList";
import BlogCreate from "./CrearBlog";
import BlogEdit from "./BlogEdit";
import BlogPendingApproval from "./ConfirmarBlog";

const BlogManager = () => {
  const [view, setView] = useState("list");
  const [editBlogId, setEditBlogId] = useState(null);

  const handleEdit = (id) => {
    setEditBlogId(id);
    setView("edit");
  };

  return (
    <div className="blog-manager">
      <h2 className="poppins-semibold">Gestión de Blogs</h2>
      <div className="buttons"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "1rem",
        // padding: "2rem"
      }}>
        <button style={{ padding: "5px 10px" }} onClick={() => setView("list")}>Ver Blogs</button>
        <button style={{ padding: "5px 10px" }} onClick={() => setView("create")}>Crear Blog</button>
        <button style={{ padding: "5px 10px" }} onClick={() => setView("pending")}>Blogs por Confirmar</button>
      </div>
      <br />
      <hr />
      <div className="content">
        {view === "list" && <BlogList onEdit={handleEdit} />}
        {view === "create" && <BlogCreate />}
        {view === "edit" && editBlogId && <BlogEdit blogId={editBlogId} />}
        {view === "pending" && <BlogPendingApproval />}
      </div>
    </div>
  );
};

export default BlogManager;
