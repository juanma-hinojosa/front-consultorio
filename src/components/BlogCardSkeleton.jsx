import '../css/components/BlogCard.css';
import '../css/components/BlogCardSkeleton.css';

const BlogCardSkeleton = () => {
  return (
    <div className="blog-card skeleton-card">
      <div className="skeleton-image"></div>
      <div className="blog-card-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-intro"></div>
        <div className="skeleton-button"></div>
      </div>
    </div>
  );
};

export default BlogCardSkeleton;
