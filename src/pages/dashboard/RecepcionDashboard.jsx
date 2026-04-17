import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useState } from 'react';
import logo from "/img/white.png"
import "../../css/pages/DashboardPage.css"
import PacienteManager from '../doctores/pacientes/PacienteManager';
// import HistoriaClinicaManager from '../Admin/fichaClinica/HistoriaClinicaManager';
import LogoutButton from '../../components/hooks/Logout';
import TurnosManager from '../recepcionista/turnos/TurnoManager';
import BirthdayAlertManager from '../recepcionista/birthday/BirthdayAlertManager';
import ConsultaVirtualManager from '../Admin/conferencia/ConsultaVirtualManager';
// import FlyerManager from '../Admin/flyer/FlyerManager';
// import TurnosManager from './turnos/TurnoManager';

function DashboardRecepcion() {
  const [view, setView] = useState("turnos");
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Estados para los cumpleaños movidos aquí
  const [birthdayAlert, setBirthdayAlert] = useState(false);
  const [pacientesCumple, setPacientesCumple] = useState([]);
  const [loadingCumple, setLoadingCumple] = useState(true);


  const navigate = useNavigate();
  const token = localStorage.getItem("token");


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    // console.log(storedUser);

    setUser(storedUser);
  }, []);

  useEffect(() => {
    const fetchCumpleaños = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/patients`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const pacientes = await res.json();
        const hoy = new Date();
        const proximos = [];

        pacientes.forEach(p => {
          if (!p.fechaNacimiento) return;

          const [anioStr, mesStr, diaStr] = p.fechaNacimiento.split("T")[0].split("-");
          const diaNac = parseInt(diaStr);
          const mesNac = parseInt(mesStr);
          const anioNac = parseInt(anioStr);

          const esHoy = hoy.getDate() === diaNac && hoy.getMonth() + 1 === mesNac;
          const años = hoy.getFullYear() - anioNac;
          const cumpleEsteAño = new Date(hoy.getFullYear(), mesNac - 1, diaNac);
          const diff = (cumpleEsteAño - hoy) / (1000 * 60 * 60 * 24);

          if (esHoy || (diff >= 0 && diff <= 7)) {
            proximos.push({
              nombre: p.nombre,
              apellido: p.apellido,
              telefono: p.telefono,
              dia: diaNac,
              mes: mesNac,
              cumpleAnios: años,
              hoy: esHoy
            });
          }
        });

        setPacientesCumple(proximos);

        const hayCumplesHoy = proximos.some(p => p.hoy);
        setBirthdayAlert(hayCumplesHoy);

        if (hayCumplesHoy) {
          const todayKey = new Date().toISOString().split("T")[0];
          const lastPlayed = localStorage.getItem("birthdaySoundPlayed");

          if (lastPlayed !== todayKey) {
            const audio = new Audio('/sonido.mp3');
            audio.play().catch(() => { });
            localStorage.setItem('birthdaySoundPlayed', todayKey);
          }
        }
      } catch (error) {
        console.error("Error obteniendo cumpleaños:", error);
      } finally {
        setLoadingCumple(false);
      }
    };

    if (token) {
      fetchCumpleaños();
    }
  }, [token]);



  // const handleLogout = () => {
  //   // Eliminar token y datos de usuario
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('user');

  //   // Redirigir a login
  //   navigate('/login');
  // };

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
            {/* <li onClick={() => { setView("empleados"); setIsMenuOpen(false); }}>
              <Icon icon="mdi:account-group" /> Empleados
            </li> */}
            <li onClick={() => { setView("pacientes"); setIsMenuOpen(false); }}>
              <Icon icon="mdi:account-heart" /> Pacientes
            </li>

            <li
              onClick={() => { setView("cumpleaños"); setIsMenuOpen(false); }}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <span>
                <Icon icon="mdi:party-popper" /> Cumpleaños
              </span>

              {birthdayAlert && (
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    background: "red",
                    borderRadius: "50%",
                    marginLeft: "10px"
                  }}
                ></span>
              )}
            </li>

            <li onClick={() => { setView("turnos"); setIsMenuOpen(false); }}>
              <Icon icon="mdi:calendar-clock" /> Turnos
            </li>
            <li onClick={() => { setView('consulta'); setIsMenuOpen(false) }} >
              <Icon icon="mdi:teleconference" /> Consulta Virtual
            </li>
            {/* <li onClick={() => { setView("pagos"); setIsMenuOpen(false); }}>
              <Icon icon="mdi:currency-usd" /> Pagos
            </li> */}
            {/* <li onClick={() => { setView("tratamientos"); setIsMenuOpen(false); }}>
              <Icon icon="mdi:tooth-outline" /> Tratamientos
            </li> */}
            {/* <li onClick={() => { setView("blog"); setIsMenuOpen(false); }}>
              <Icon icon="mdi:blogger" /> Blogs
            </li> */}
            {/* <li onClick={() => { setView("flyers"); setIsMenuOpen(false); }}>
              <Icon icon="lets-icons:img-out-box-fill" /> Flyers
            </li> */}

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
              {/* <p><strong>Email:</strong> {user.email}</p> */}
              {/* <p><strong >Rol:</strong> {user.role}</p> */}
              <p><strong >Usuario/a:</strong> {user.nombre} {user.apellido}</p>
            </div>
          )}
        </header>

        <section className="admin-panel-content">
          {/* {view === "empleados" && <EmpleadoManager />} */}
          {view === "pacientes" && <PacienteManager />}

          {view === "cumpleaños" && (
            <BirthdayAlertManager
              pacientesCumple={pacientesCumple}
              loading={loadingCumple}
            />
          )}


          {/* {view === "historiaClinica" && <HistoriaClinicaManager />} */}
          {view === "turnos" && <TurnosManager />}
          {view === 'consulta' && <ConsultaVirtualManager />}

          {/* {view === "pagos" && <PagosManager />} */}

          {/* {view === "tratamientos" && <TratamientosManager />} */}
          {/* {view === "blog" && <BlogManager userRole={user?.role} />} */}
          {/* {view === "flyers" && <FlyerManager />} */}
        </section>
      </main>
    </div>
  )
}

export default DashboardRecepcion;