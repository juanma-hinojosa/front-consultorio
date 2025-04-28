import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/pages/DashboardPage.css';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import BlogItem from '../../components/BlogItem';
import SkeletonItem from '../../components/SkeletonItem';

const DashboardPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [flyers, setFlyers] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchFlyers = async () => {
    try {
      const res = await fetch('https://consultorio-back-xg97.onrender.com/api/flyers/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setFlyers(data);
    } catch (err) {
      console.error('Error al obtener flyers', err);
    }
  };


  const fetchBlogs = async () => {
    try {
      const res = await fetch('https://consultorio-back-xg97.onrender.com/api/blogs');
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error('Error al obtener blogs', err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Seguro que quieres eliminar este blog?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`https://consultorio-back-xg97.onrender.com/api/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setBlogs(blogs.filter((blog) => blog._id !== id));
        toast.success('Blog eliminado correctamente');
      } else {
        const data = await res.json();
        toast.error(data.message || 'Error al eliminar el blog');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error al conectar con el servidor');
    }
  };

  const handleDeleteFlyer = async (id) => {
    const confirmDelete = window.confirm('¿Seguro que quieres eliminar este flyer?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`https://consultorio-back-xg97.onrender.com/api/flyers/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setFlyers(flyers.filter((flyer) => flyer._id !== id));
        toast.success('✅ Flyer eliminado correctamente');

      } else {
        const data = await res.json();
        toast.error(data.message || '❌ Error al eliminar el flyer');
      }
    } catch (err) {
      console.error(err);
      toast.error('❌ Error al conectar con el servidor');
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  useEffect(() => {
    fetchBlogs();
    fetchFlyers();
  }, []);
  const formatearFecha = (fechaISO) => {
    const [anio, mes, dia] = fechaISO.split('T')[0].split('-');
    return `${dia}/${mes}/${anio}`;
  };
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Panel de Administración</h1>
        <div>
          <button onClick={handleLogout}>
            <Icon icon="mdi:logout" /> Cerrar sesión
          </button>
          <Link to="/admin/create-blog">
            <button><Icon icon="mdi:plus-box" /> Crear nuevo blog</button>
          </Link>
          <Link to="/admin/create-flyer">
            <button><Icon icon="mdi:file-image-plus" /> Crear Flyer</button>
          </Link>

          <Link to="/admin/turnos">
            <button><Icon icon="tabler:calendar" /> Gestion de turnos</button>
          </Link>

        </div>
      </div>

      <div className="flyer-list">
        <h2>Flyers</h2>
        {flyers.length === 0 ? (
          // <p>No hay flyers creados aún.</p>

          <>
            {[...Array(2)].map((_, i) => <SkeletonItem key={i} />)}
            <p>No hay flyers creados aún.</p>
          </>
        ) : (
          flyers.map((flyer, index) => (
            <div key={flyer._id} className={`flyer-item ${index % 2 === 0 ? 'even' : 'odd'}`}>
              <img src={flyer.imageUrl} alt={flyer.text} />

              <div className="info">
                <h3>{flyer.text}</h3>
                <p>{flyer.paragraph}</p>
                <p><strong>Expira:</strong> {formatearFecha(flyer.expirationDate)}</p>
              </div>

              <div className="actions">
                <Link to={`/admin/flyer/edit/${flyer._id}`}>
                  <button className="edit-icon">
                    <Icon icon="mdi:pencil" width="22" />
                  </button>
                </Link>
                <button onClick={() => handleDeleteFlyer(flyer._id)} className="delete-icon">
                  <Icon icon="mdi:delete" width="22" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="blog-list">
        <h2>Blogs</h2>

        {blogs.length === 0 ? (
          <>
            {[...Array(4)].map((_, i) => <SkeletonItem key={i} />)}
            <p>No hay publicaciones aún.</p>
          </>
        ) : (
          blogs.map((blog, index) => (
            <BlogItem
              key={blog._id}
              blog={blog}
              index={index}
              handleDelete={handleDelete}
            />
          ))

        )}
      </div>
      <ToastContainer position="top-center" autoClose={3000} />

    </div>

  );
};

export default DashboardPage;
