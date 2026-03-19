import { type FC, useEffect, useRef, useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { useNavigate } from 'react-router-dom';
import styles from './ContactForm.module.css';
import Button from '../../atoms/Button/Button';

const FORMSPREE_FORM_ID = import.meta.env.VITE_FORMSPREE_FORM_ID as string;

const ContactForm: FC = () => {
  const [state, handleSubmit, reset] = useForm(FORMSPREE_FORM_ID);
  const navigate = useNavigate();
  const phoneRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [fields, setFields] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    if (state.succeeded) {
      successRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [state.succeeded]);

  const isFormValid =
    fields.name.trim() !== '' &&
    fields.email.trim() !== '' &&
    fields.message.trim() !== '';

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return value;
  };

  const stripPhoneFormat = (value: string): string => {
    return value.replace(/\D/g, '');
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const phoneInput = phoneRef.current;
    if (phoneInput && phoneInput.value) {
      phoneInput.value = `+1${stripPhoneFormat(phoneInput.value)}`;
    }
    handleSubmit(e);
  };

  if (state.succeeded) {
    return (
      <div
        ref={successRef}
        className={`${styles.form} ${styles.successWrapper}`}
      >
        <p className={styles.successMessage}>
          Thanks for reaching out! I'll get back to you soon.
        </p>
        <Button
          type="button"
          variant="primary"
          onClick={() => {
            reset();
            navigate('/photos');
          }}
          style={{ maxWidth: '16.25rem' }}
        >
          View Portfolio
        </Button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          className={styles.input}
          placeholder="What do your friends call you?"
          required
          autoComplete="name"
          value={fields.name}
          onChange={handleFieldChange}
        />
        <ValidationError
          field="name"
          prefix="Name"
          errors={state.errors}
          className={styles.error}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          className={styles.input}
          placeholder="you@somewhere-cool.com"
          required
          autoComplete="email"
          value={fields.email}
          onChange={handleFieldChange}
        />
        <ValidationError
          field="email"
          prefix="Email"
          errors={state.errors}
          className={styles.error}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="phone" className={styles.label}>
          Phone (Optional)
        </label>
        <div className={styles.phoneWrapper}>
          <span className={styles.phonePrefix}>+1</span>
          <input
            ref={phoneRef}
            id="phone"
            type="tel"
            name="phone"
            className={`${styles.input} ${styles.phoneInput}`}
            placeholder="5551234567"
            maxLength={14}
            title="Enter a 10-digit US phone number"
            autoComplete="tel"
            onKeyDown={(e) => {
              if (
                !/[\d]/.test(e.key) &&
                ![
                  'Backspace',
                  'Delete',
                  'Tab',
                  'ArrowLeft',
                  'ArrowRight',
                  'Home',
                  'End',
                ].includes(e.key) &&
                !e.ctrlKey &&
                !e.metaKey
              ) {
                e.preventDefault();
              }
            }}
            onFocus={(e) => {
              e.target.value = stripPhoneFormat(e.target.value);
            }}
            onBlur={(e) => {
              e.target.value = formatPhoneNumber(e.target.value);
            }}
          />
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor="message" className={styles.label}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          className={styles.textarea}
          placeholder="Tell me about the wild idea you have..."
          required
          value={fields.message}
          onChange={handleFieldChange}
        />
        <ValidationError
          field="message"
          prefix="Message"
          errors={state.errors}
          className={styles.error}
        />
      </div>
      <div className="mt-4">
        <Button
          type="submit"
          variant="primary"
          disabled={state.submitting || !isFormValid}
        >
          {state.submitting ? 'Sending...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
