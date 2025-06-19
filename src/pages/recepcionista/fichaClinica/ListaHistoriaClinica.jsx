import React, { useState } from 'react';
import BuscarPacienteInput from './BuscarPaciente';
import { toast } from "react-toastify";
import LightGallery from 'lightgallery/react';
// import Modal from 'react-modal';

// import styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';


// import plugins if you need
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

const ListaHistoriaClinica = () => {
  const [paciente, setPaciente] = useState(null);
  const [registros, setRegistros] = useState([]);

  const buscarRegistros = async id => {
    try {
      // const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/records/paciente/${id}`, {
        credentials: 'include',
      });
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(text || 'Respuesta no JSON del servidor');
      }


      const data = await res.json();
      // console.log(data);
      
      toast.success('Registros obtenidos con éxito');
      setRegistros(data);
    } catch (error) {
      console.error('Error al obtener registros', error);
      toast.error('Error al obtener registros');
    }
  };

  const onInit = () => {
    // console.log('lightGallery has been initialized');
  };

  return (
    <div className='poppins-regular'>
      <h3 className='poppins-regular'>Ver historia clínica</h3>
      <BuscarPacienteInput onSelect={p => {
        setPaciente(p);
        buscarRegistros(p._id);
      }} />
      {registros.map(r => (
        <div key={r._id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
          <h4>- {r.titulo}</h4>
          <p><strong>Doctor:</strong> {r.doctor?.nombre} {r.doctor?.apellido} </p>
          <p><strong>Especialidad:</strong> {r.doctor?.especialidad} - {r.doctor?.role}</p>
          <p><strong>Descripcion:</strong> {r.descripcion}</p>
          <p>
            <strong>Fecha:</strong>{' '}
            {new Date(r.fecha).toLocaleDateString('es-AR', {
              timeZone: 'America/Argentina/Buenos_Aires',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })} - {new Date(r.fecha).toLocaleTimeString('es-AR', {
              timeZone: 'America/Argentina/Buenos_Aires',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })} hs
          </p>

          {/* {r.imagenes.map((img, i) => (
            <img key={i} src={img} alt="registro" width="150" />
          ))} */}

          <LightGallery
            onInit={onInit}
            speed={500}
            plugins={[lgThumbnail, lgZoom]}
          >
            {r.imagenes.map((img, i) => (
              <a key={i} href={img}>
                <img src={img} alt="registro" width="150" />
              </a>

            ))}
          </LightGallery>

        </div>
      ))}
    </div>
  );
};

export default ListaHistoriaClinica;
