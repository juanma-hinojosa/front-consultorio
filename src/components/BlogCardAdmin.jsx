import BlogCard from './BlogCardComponent';

const BlogCardAdmin = ({ blog, onEdit, onDelete }) => {
  return (
    <div style={{ position: "relative" }}>
      <BlogCard blog={blog} />

      <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
        <button className="blog-card-button" onClick={() => onEdit(blog._id)} style={{ marginRight: "10px" }}>
          Editar
        </button>
        <button className="blog-card-button" onClick={() => onDelete(blog._id)}>
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default BlogCardAdmin;
