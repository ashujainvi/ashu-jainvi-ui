import styles from './Pill.module.css';

interface PillProps {
  variant?: 'primary' | 'secondary';
  children: any;
}

const Pill = ({
  variant = 'primary',
  children
}: PillProps) => (
  <div className={`rounded-full ${styles.pill} ${styles[variant]}`}>
    {children}
  </div>
);

export default Pill;
