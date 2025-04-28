import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ServiceDetailSkeleton = () => {
  return (
    <>
    <div
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "300px",
        width: "100%",
        backgroundColor: "#e0e0e0" // Color de fondo mientras carga
      }}
    >
      <Skeleton height="100%" width="100%" />
    </div>

    <section className="service-detail-page" style={{ padding: '1rem' }}>
      <h1>
        <Skeleton width="60%" height={40} />
      </h1>

      <h3>
        <Skeleton width="40%" height={30} />
      </h3>

      <p>
        <Skeleton count={5} />
      </p>

      {/* Simulamos también el formulario de turno */}
      <div style={{ marginTop: '2rem' }}>
        <Skeleton width="80%" height={50} style={{ marginBottom: '1rem' }} />
        <Skeleton width="80%" height={50} style={{ marginBottom: '1rem' }} />
        <Skeleton width="40%" height={45} style={{ marginRight: '1rem' }} />
        <Skeleton width="40%" height={45} />
      </div>
    </section>
  </>
  );
};

export default ServiceDetailSkeleton;
