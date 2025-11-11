// src/components/skeleton/SkeletonVideo.jsx
const SkeletonVideo = () => {
  return (
    <section className="ultimo-video-container">
      <h2>Último Video</h2>
      <div
        className="skeleton-video"
        style={{
          width: "100%",
          height: "300px",
          backgroundColor: "#ddd",
          borderRadius: "10px",
          animation: "pulse 1.5s infinite",
        }}
      ></div>
      <style>
        {`
          @keyframes pulse {
            0% { background-color: #e0e0e0; }
            50% { background-color: #f0f0f0; }
            100% { background-color: #e0e0e0; }
          }
        `}
      </style>
    </section>
  );
};

export default SkeletonVideo;
