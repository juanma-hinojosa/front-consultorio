import '../css/components/BlogCard.css'; // Estilos personalizados
import { Link } from "react-router-dom";
import slugify from './slugify';

const BlogCard = ({ blog }) => {
  const slug = slugify(blog.title);
  const { _id, title, intro, category, mainImageUrl } = blog;


  return (
    <div className="blog-card" data-aos="fade-up">
     <img src={mainImageUrl} alt={title} className="blog-card-image" />
      <div className="blog-card-content" style={{textAlign: "center"}}>
        <h3 className="blog-card-title">{blog.title}</h3>
        <p className="blog-card-intro">{blog.intro}</p>
        <Link to={`/blog/${slug}?id=${blog._id}`} className="blog-card-button">
          Leer más →
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
