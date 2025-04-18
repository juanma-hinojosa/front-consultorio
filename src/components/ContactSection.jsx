import "../css/components/ContactSection.css"
import logo from "../../public/logo.png"
const ContactSection = () => {
  return (
    <section className="contact-section">
      <div className="contact-header">
        <div className="contact-info">
          <h2 data-aos="zoom-out"
            data-aos-duration="500"
          >Policonsultorio San Marcos</h2>
          <h4 data-aos="zoom-out"
            data-aos-duration="500">Subheading for description or instructions</h4>
          <p data-aos="zoom-out"
            data-aos-duration="500">
            Body text for your whole article or post. We'll put in some lorem ipsum to show how a filled-out page might look:
          </p>
          <p data-aos="zoom-out"
            data-aos-duration="500">
            Excepteur efficient emerging, minim veniam anim aute carefully curated Ginza conversation exquisite perfect nostrud nisi intricate Content. Qui international first-class nulla ut. Punctual adipiscing, essential lovely queen tempor eiusmod irure.
            Exclusive izakaya charming Scandinavian impeccable aute quality of life soft power pariatur Melbourne occaecat discerning.
            Qui wardrobe aliquip, et Porter destination Toto remarkable officia Helsinki excepteur Basset hound. Zürich sleepy perfect consectetur.
          </p>
        </div>
        <div  className="contact-logo">
          <img data-aos="zoom-in" src={logo} alt="Logo San Marcos" />
        </div>
      </div>


    </section>
  );
};

export default ContactSection;
