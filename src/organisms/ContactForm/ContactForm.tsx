import type { FC } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import styles from './ContactForm.module.css';
import Button from '../../atoms/Button/Button';

const FORMSPREE_FORM_ID = import.meta.env.VITE_FORMSPREE_FORM_ID as string;

const ContactForm: FC = () => {
  const [state, handleSubmit, reset] = useForm(FORMSPREE_FORM_ID);

  if (state.succeeded) {
    return (
      <div className={styles.form}>
        <p className={styles.successMessage}>Thanks for reaching out! I'll get back to you soon.</p>
        <Button type="button" variant="primary" onClick={reset}>Send another message</Button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>Name</label>
        <input
          id="name"
          type="text"
          name="name"
          className={styles.input}
          placeholder="What do your friends call you?"
          required
          autoComplete="name"
        />
        <ValidationError field="name" prefix="Name" errors={state.errors} className={styles.error} />
      </div>
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>Email</label>
        <input
          id="email"
          type="email"
          name="email"
          className={styles.input}
          placeholder="you@somewhere-cool.com"
          required
          autoComplete="email"
        />
        <ValidationError field="email" prefix="Email" errors={state.errors} className={styles.error} />
      </div>
      <div className={styles.field}>
        <label htmlFor="phone" className={styles.label}>Phone (Optional)</label>
        <input
          id="phone"
          type="tel"
          name="phone"
          className={styles.input}
          placeholder="Only if you're a phone person"
          autoComplete="tel"
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="message" className={styles.label}>Message</label>
        <textarea
          id="message"
          name="message"
          className={styles.textarea}
          placeholder="Tell me about the wild idea you have..."
          required
        />
        <ValidationError field="message" prefix="Message" errors={state.errors} className={styles.error} />
      </div>
      <div className="mt-4">
        <Button type="submit" variant="primary" disabled={state.submitting}>
          {state.submitting ? 'Sending...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
