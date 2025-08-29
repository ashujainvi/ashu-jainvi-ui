import styles from './Pill.module.css';

interface PillProps {
  variant?: 'primary' | 'secondary';
  shape?: 'capsule' | 'circle';
  children: any;
}

const Pill = ({
  variant = 'primary',
  shape = 'capsule',
  children
}: PillProps) => (
  <div className={`${styles.pill} ${styles[variant]} ${styles[shape]}`}>
    {children}
  </div>
);

export default Pill;
