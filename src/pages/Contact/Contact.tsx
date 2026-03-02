import styles from './Contact.module.css';
import ContactForm from '../../organisms/ContactForm/ContactForm';

const Contact = () => (
  <div className={styles.contact}>
    <section className={styles.heroSection}>
      <span className="text-overline">Get in touch</span>
      <h1 className="display">Contact</h1>
    </section>
    <div className={styles.formContainer}>
      <ContactForm />
    </div>
  </div>
);

export default Contact;
