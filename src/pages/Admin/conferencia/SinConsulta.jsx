import { Icon } from "@iconify/react/dist/iconify.js"

function SinConsultaComponent() {
  return (
    <section
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        
        color: "#555",
        minHeight: "300px", // 👈 clave
        width: "100%",
      }}
    >
      <div style={{ flexDirection: 'column', textAlign: 'center' }} >
        <Icon style={{fontSize: "50px",}} icon="hugeicons:computer-user" />
        <p style={{fontSize: "16px",}} >Sin turnos asignados</p>
      </div>

    </section>
  )
}

export default SinConsultaComponent