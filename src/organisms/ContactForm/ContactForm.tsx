import { type FC, type FormEvent, useState } from 'react';
import styles from './ContactForm.module.css';
import Button from '../../atoms/Button/Button';

const ContactForm: FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>Name</label>
        <input
          id="name"
          type="text"
          className={styles.input}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="What do your friends call you?"
          required
          autoComplete="name"
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>Email</label>
        <input
          id="email"
          type="email"
          className={styles.input}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="you@somewhere-cool.com"
          required
          autoComplete="email"
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="phone" className={styles.label}>Phone (Optional)</label>
        <input
          id="phone"
          type="tel"
          className={styles.input}
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Only if you're a phone person"
          autoComplete="tel"
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="message" className={styles.label}>Message</label>
        <textarea
          id="message"
          className={styles.textarea}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Tell me about the wild idea you have..."
          required
        />
      </div>
      <div className="mt-4">
        <Button type="submit" variant="primary">Submit</Button>
      </div>
    </form>
  );
};

export default ContactForm;
