import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import "../../../css/components/videoCard.css"

export default function VideoManager() {
  const [view, setView] = useState("list")
  const [videos, setVideos] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null); // ID del video en edición


  // Cargar todos los videos
  const fetchVideos = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/videos`);
      const data = await res.json();
      // console.log(data);

      setVideos(data);
    } catch (err) {
      setError('Error cargando videos');
      toast.error('Error cargando videos')
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!titulo) {
      alert('El título es obligatorio');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Si está en modo edición
      if (editingId) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/videos/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ titulo, descripcion }),
        });

        if (!res.ok) throw new Error('Error al actualizar video');

        const updatedVideo = await res.json();
        setVideos(videos.map(v => v._id === editingId ? updatedVideo.video : v));
        toast.success("Video actualizado");
      } else {
        // Crear nuevo
        if (!videoFile) {
          alert('Debe seleccionar un archivo de video');
          return;
        }

        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('titulo', titulo);
        formData.append('descripcion', descripcion);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/videos/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Error al subir video');

        const newVideo = await res.json();
        setVideos([newVideo.video, ...videos]);
        toast.success("Video subido con éxito");
      }

      // Resetear formulario
      setTitulo('');
      setDescripcion('');
      setVideoFile(null);
      setEditingId(null);
      setView("list");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (video) => {
    setTitulo(video.titulo);
    setDescripcion(video.descripcion || '');
    setEditingId(video._id);
    setView('create');
  };

  const cancelEdit = () => {
    setTitulo('');
    setDescripcion('');
    setVideoFile(null);
    setEditingId(null);
    setView('list');
  };


  // Eliminar video
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este video?')) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/videos/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error eliminando video');
      toast.success("Video eliminado");
      setVideos(videos.filter((v) => v._id !== id));
    } catch (err) {
      setError(err.message);
      toast.error("Error al eliminar video");
    }
  };

  return (
    <div>
      <h2>Gestor de Videos</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        padding: '1rem',
      }}>
        <button style={{ padding: "10px" }} onClick={() => setView("create")} >Nuevo video</button>
        <button style={{ padding: "10px" }} onClick={() => setView("list")}>Lista de videos</button>
      </div>

      <hr />
      <br />

      {view === "create" && (
        <section>
          <h3>{editingId ? 'Editar Video' : 'Nuevo Video'}</h3>
          <form onSubmit={handleUpload} style={{ marginBottom: 20 }}>
            <input
              type="text"
              placeholder="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              style={{ width: '100%', padding: 8, marginBottom: 10 }}
            />
            <textarea
              placeholder="Descripción (opcional)"
              rows={25}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              style={{
                resize: 'vertical',
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                marginBottom: 10
              }}
            />

            {!editingId && (
              <input
                type="file"
                accept="video/mp4,video/webm,video/ogg"
                onChange={(e) => setVideoFile(e.target.files[0])}
                required
                style={{ marginBottom: 10 }}
              />
            )}

            <br />

            <button style={{ padding: "10px", marginRight: 10 }} type="submit" disabled={loading}>
              {loading ? 'Guardando...' : editingId ? 'Actualizar Video' : 'Subir Video'}
            </button>

            {editingId && (
              <button style={{ padding: "10px", backgroundColor: '#ccc' }} onClick={cancelEdit} type="button">
                Cancelar
              </button>
            )}
          </form>


          {error && <p style={{ color: 'red' }}>{error}</p>}
        </section>
      )}


      {view === "list" && (
        <>
          <h3>Lista de Videos</h3>

          <section
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '1rem',
              padding: '1rem',
            }} >
            {videos.length === 0 ? (
              <p>No hay videos subidos.</p>
            ) : (
              videos.map((video) => (
                <div key={video._id}
                  className='video-card'
                >
                  <video
                    src={video.videoUrl}
                    controls
                    style={{ maxWidth: '20%', height: 'auto', marginBottom: 10 }}
                  />
                  <div>
                    <h3>{video.titulo}</h3>
                    {/* {video.descripcion && <p>{video.descripcion}</p>} */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '1rem',
                        padding: '1rem',
                      }}
                    >
                      <button onClick={() => handleDelete(video._id)} 
                      style={{ backgroundColor: '#ff4646ff', color: 'white', border:"none", padding:5 }}
                      >
                        Eliminar
                      </button>

                      <button
                        onClick={() => handleEdit(video)}
                        style={{ backgroundColor: '#3CB371', color: 'white', border:"none", padding:5  }}
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>
        </>
      )}
    </div>
  );
}
