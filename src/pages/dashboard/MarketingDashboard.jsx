import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useState } from 'react';
import logo from "/img/white.png"
import "../../css/pages/DashboardPage.css"
// import HistoriaClinicaManager from '../Admin/fichaClinica/HistoriaClinicaManager';
import LogoutButton from '../../components/hooks/Logout';
import VideoManager from '../marketing/video/VideoManager';
import FlyerManager from '../marketing/flyer/FlyerManager';
import BlogManager from '../marketing/blog/BlogManager';

function MarketingDashboard() {
  const [view, setView] = useState("flyers");
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    // Eliminar token y datos de usuario
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirigir a login
    navigate('/login');
  };
  return (
    <div className="admin-panel-container">
      <aside className={`admin-aside ${isMenuOpen ? "open" : ""}`}>
        <button
          className="admin-close-btn"
          onClick={() => setIsMenuOpen(false)}
        >
          <Icon icon="mdi:close" />
        </button>
        <nav className="admin-nav">
          <Link to="/">
            <figure
              style={{
                width: "100px",
                height: "100px",
                margin: "20px 0"
              }}
            >
              <img style={{ width: "100%" }} src={logo} alt="logo" />
            </figure>
          </Link>

          <ul className="poppins-light">



            <li onClick={() => { setView("blog"); setIsMenuOpen(false); }}>
              <Icon icon="mdi:blogger" /> Blogs
            </li>
            <li onClick={() => { setView("flyers"); setIsMenuOpen(false); }}>
              <Icon icon="lets-icons:img-out-box-fill" /> Flyers
            </li>
            <li onClick={() => { setView("reels"); setIsMenuOpen(false); }}>
              <Icon icon="typcn:video" /> Reels
            </li>

            {/* <li onClick={handleLogout}>
              <Icon icon="mdi:logout" /> Cerrar sesión
            </li> */}

            <li >
              <Icon icon="mdi:logout" /> <LogoutButton />
            </li>

          </ul>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <button
            className="admin-menu-toggle"
            onClick={() => setIsMenuOpen(true)}
          >
            <Icon icon="mdi:menu" />
          </button>
          <h1 className="poppins-light">Panel de Administrador</h1>
          {user && (
            <div className="admin-user-info poppins-regular">
              <p><strong >Usuario/a:</strong> {user.nombre} {user.apellido}</p>
            </div>
          )}
        </header>

        <section className="admin-panel-content">
          {view === "blog" && <BlogManager userRole={user?.role} />}
          {view === "flyers" && <FlyerManager />}
          {view === "reels" && <VideoManager />}

        </section>
      </main>
    </div>
  )
}

export default MarketingDashboard;