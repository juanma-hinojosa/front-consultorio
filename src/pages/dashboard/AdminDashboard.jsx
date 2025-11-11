import { Link, useNavigate } from 'react-router-dom';
import EmpleadoManager from '../Admin/empleados/EmpleadoManager';
import { useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useState } from 'react';
import logo from "/img/white.png"
import "../../css/pages/DashboardPage.css"
import PacienteManager from '../Admin/pacientes/PacienteManager';
import HistoriaClinicaManager from '../Admin/fichaClinica/HistoriaClinicaManager';
// import LogoutButton from '../../components/hooks/Logout';
import FlyerManager from '../Admin/flyer/FlyerManager';
import TurnosManager from '../Admin/turnos/TurnoManager';
import BlogManager from '../Admin/blog/BlogManager';
import VideoManager from '../Admin/video/VideoManager';

function DashboardAdmin() {
  const [view, setView] = useState("turnos");
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    // console.log(storedUser);

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
            <li onClick={() => { setView("empleados"); setIsMenuOpen(false); }}>
              <Icon icon="mdi:account-group" /> Empleados
            </li>
            <li onClick={() => { setView("pacientes"); setIsMenuOpen(false); }}>
              <Icon icon="mdi:account-heart" /> Pacientes
            </li>
            <li onClick={() => { setView("historiaClinica"); setIsMenuOpen(false); }}>
              <Icon icon="mdi:book-open-page-variant" /> Historia Clínica
            </li>
            <li onClick={() => { setView("turnos"); setIsMenuOpen(false); }}>
              <Icon icon="mdi:calendar-clock" /> Turnos
            </li>
            {/* <li onClick={() => { setView("pagos"); setIsMenuOpen(false); }}>
              <Icon icon="mdi:currency-usd" /> Pagos
            </li> */}
            {/* <li onClick={() => { setView("tratamientos"); setIsMenuOpen(false); }}>
              <Icon icon="mdi:tooth-outline" /> Tratamientos
            </li> */}
            <li onClick={() => { setView("blog"); setIsMenuOpen(false); }}>
              <Icon icon="mdi:blogger" /> Blogs
            </li>
            <li onClick={() => { setView("flyers"); setIsMenuOpen(false); }}>
              <Icon icon="lets-icons:img-out-box-fill" /> Flyers
            </li>

            <li onClick={() => { setView("reels"); setIsMenuOpen(false); }}>
              <Icon icon="typcn:video" /> Reels
            </li>

            <li onClick={handleLogout}>
              <Icon icon="mdi:logout" /> Cerrar sesión
            </li>

            {/* <li >
              <Icon icon="mdi:logout" /> <LogoutButton />
            </li> */}

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
              {/* <p><strong>Email:</strong> {user.email}</p> */}
              <p><strong >Rol:</strong> {user.role}</p>
              <p><strong >Usuario/a:</strong> {user.nombre} {user.apellido}</p>
            </div>
          )}
        </header>

        <section className="admin-panel-content">
          {view === "empleados" && <EmpleadoManager />}
          {view === "pacientes" && <PacienteManager />}
          {view === "historiaClinica" && <HistoriaClinicaManager />}
          {view === "turnos" && <TurnosManager />}
          {/* {view === "pagos" && <PagosManager />} */}

          {/* {view === "tratamientos" && <TratamientosManager />} */}
          {view === "blog" && <BlogManager userRole={user?.role} />}
          {view === "flyers" && <FlyerManager />}
          {view === "reels" && <VideoManager />}
        </section>
      </main>
    </div>
  )
}

export default DashboardAdmin;