import { useEffect, useState } from "react";
import SkeletonVideo from "./SkeletonVideo";
import "../css/components/videoCard.css"

const UltimoVideo = () => {
  const [ultimoVideo, setUltimoVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUltimoVideo = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/videos`);
        const data = await res.json();
        // console.log(data[0]);
        

        if (Array.isArray(data) && data.length > 0) {
          // const ultimo = data[data.length - 1]; // O puedes usar sort en backend para optimizar
          const ultimo = data[0]; // O puedes usar sort en backend para optimizar
          setUltimoVideo(ultimo);
          // console.log(ultimo);
          // console.log(setUltimoVideo);
          
        }
      } catch (err) {
        console.error("Error al obtener el último video:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUltimoVideo();
  }, []);

  if (loading) return <SkeletonVideo />;
  if (!ultimoVideo) return null;

  const { videoUrl, titulo, descripcion, createdAt } = ultimoVideo;
  const gridStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    padding: '16px',
  };

  return (
    <section className="ultimo-video-container">
      <h2 style={{textAlign:"center"}} >Último Video</h2>

      <div style={gridStyle}>
        <div className='video-card'>
          <video controls>
            <source src={videoUrl} type="video/mp4" />
            Tu navegador no soporta el video.
          </video>

          <div style={{ backgroundColor: "white", padding: "1rem" }}>
            <h3>{titulo}</h3>
            {descripcion && <p>{descripcion}</p>}
            <p
              style={{
                marginTop: "7px",
                fontSize: "12px",
                color: "#777",
              }}
            >
              Subido el {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </section>


  );
};

export default UltimoVideo;
