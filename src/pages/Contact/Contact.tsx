import styles from './Contact.module.css';
import ContactForm from '../../organisms/ContactForm/ContactForm';
import PageHero from '../../components/PageHero/PageHero';

const Contact = () => (
  <PageHero overline="Get in touch" title="Contact">
    <div className={styles.formContainer}>
      <ContactForm />
    </div>
  </PageHero>
);

export default Contact;
