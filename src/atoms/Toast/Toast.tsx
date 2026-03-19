import type { ReactNode } from 'react';
import styles from './Toast.module.css';

interface ToastProps {
  children: ReactNode;
  className?: string;
}

const Toast = ({ children, className = '' }: ToastProps) => (
  <span className={`${styles.toast} ${className}`.trim()}>{children}</span>
);

export default Toast;
