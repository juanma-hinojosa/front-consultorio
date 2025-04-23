// src/components/SkeletonItem.jsx
import '../css/components/SkeletonItem.css';

const SkeletonItem = () => {
  return (
    <div className="skeleton-item">
      <div className="skeleton-img" />
      <div className="skeleton-content">
        <div className="skeleton-line title" />
        <div className="skeleton-line short" />
        <div className="skeleton-line long" />
      </div>
    </div>
  );
};

export default SkeletonItem;
