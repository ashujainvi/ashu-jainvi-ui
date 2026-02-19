import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  as?: 'button' | 'link';
  to?: string;
}

const Button = ({ 
  children, 
  variant = 'primary', 
  as = 'button',
  to,
  className = '',
  ...props 
}: ButtonProps) => {
  const buttonClasses = `${styles.button} ${styles[variant]} ${className}`.trim();

  if (as === 'link' && to) {
    return (
      <Link to={to} className={buttonClasses} role="button">
        {children}
      </Link>
    );
  }

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
