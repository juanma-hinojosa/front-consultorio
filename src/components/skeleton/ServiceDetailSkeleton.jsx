import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ServiceDetailSkeleton = () => {
  return (
    <>
      <div
        style={{
          height: '300px',
          width: '100%',
          backgroundColor: '#ddd',
        }}
      >
        <Skeleton height="100%" />
      </div>

      <section className="service-detail-page" style={{ padding: '2rem' }}>
        <h1>
          <Skeleton width={250} height={32} />
        </h1>
        <h3>
          <Skeleton width={200} height={24} />
        </h3>

        <div style={{ margin: '1rem 0' }}>
          <Skeleton width={180} height={40} borderRadius={10} />
        </div>

        <p>
          <Skeleton count={4} />
        </p>

        <div style={{ marginTop: '2rem' }}>
          <Skeleton height={200} />
        </div>
      </section>
    </>
  );
};

export default ServiceDetailSkeleton;
