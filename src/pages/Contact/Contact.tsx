import styles from './Contact.module.css';
import ContactForm from '../../organisms/ContactForm/ContactForm';
import PageHero from '../../components/PageHero/PageHero';
import Seo from '../../components/Seo/Seo';

const Contact = () => (
  <>
    <Seo
      title="Contact"
      description="Get in touch with Ashu Jainvi for photography sessions, graphic design projects, or web development work in Austin, Texas."
      path="/contact"
    />
    <PageHero overline="Get in touch" title="Contact">
      <div className={styles.formContainer}>
        <ContactForm />
      </div>
    </PageHero>
  </>
);

export default Contact;
