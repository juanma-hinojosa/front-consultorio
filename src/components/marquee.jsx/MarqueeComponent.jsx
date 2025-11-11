import Marquee from "react-fast-marquee";
import "./marquee.css";

function MarqueeComponent() {
  const osFotos = [
    { path: "./img/obra-social/os-1.png", name: "osde" },
    { path: "./img/obra-social/os-2.png", name: "swiss medical" },
    { path: "./img/obra-social/os-3.jpg", name: "medife" },
    { path: "./img/obra-social/os-4.png", name: "pami" },
    { path: "./img/obra-social/os-5.png", name: "sancor salud" },
    { path: "./img/obra-social/os-6.png", name: "medicus" },
    { path: "./img/obra-social/os-7.png", name: "omint" },
    { path: "./img/obra-social/os-8.jpg", name: "galeno" },

  ]
  return (
    <section
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "50px 20px"
      }}
    >
      <Marquee pauseOnHover={false} speed={40} gradient={true} gradientWidth={200}>
        {osFotos.map((foto, index) => (
          <img
            className="marquee-img"
            key={index}
            src={foto.path}
            alt={foto.name}
            // style={{ height: "100px", margin: "0 20px" }}
          />
        ))}
      </Marquee>
    </section>

  )
}

export default MarqueeComponent