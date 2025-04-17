import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import "../css/components/BlogItem.css"
const BlogItem = ({ blog, index, handleDelete, category }) => {
    return (
        <div className={`blog-item ${index % 2 === 0 ? 'even' : 'odd'}`}>
            <img src={blog.mainImageUrl} alt={blog.title} />

            <div className="info">
                <h3>{blog.title}</h3>
                <p>{blog.intro}</p>
                <p><strong>{blog.category}</strong></p>
            </div>

            <div className="actions">
                <Link to={`/admin/blog/edit/${blog._id}`}>
                    <button>
                        <Icon icon="mdi:pencil" width="22" className="edit-icon" />
                    </button>
                </Link>
                <button onClick={() => handleDelete(blog._id)}>
                    <Icon icon="mdi:delete" width="22" className="delete-icon" />
                </button>
            </div>
        </div>
    );
};

export default BlogItem;
