import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../../css/components/ServiceCard.css';

const ServiceCardSkeleton = () => {
  return (
    <div className="service-card" data-aos="fade-up">
      <div className="service-img-wrapper">
        <Skeleton height={150} width={150} circle={true} />
      </div>
      <div className="service-info">
        <h3><Skeleton width={150} /></h3>
        <p><Skeleton count={2} /></p>
        <div className="service-links">
          <Skeleton height={30} width={100} style={{ marginRight: '1rem' }} />
          <Skeleton height={30} width={130} />
        </div>
      </div>
    </div>
  );
};

export default ServiceCardSkeleton;
