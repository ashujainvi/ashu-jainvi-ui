import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  as?: 'button' | 'link';
  to?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-pressed'?: boolean;
}

const Button = ({ 
  children, 
  variant = 'primary', 
  as = 'button',
  to,
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  'aria-pressed': ariaPressed,
  disabled,
  ...props 
}: ButtonProps) => {
  const buttonClasses = `${styles.button} ${styles[variant]} ${className}`.trim();

  if (as === 'link' && to) {
    return (
      <Link 
        to={to} 
        className={buttonClasses} 
        role="button"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
        aria-pressed={ariaPressed}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
      >
        {children}
      </Link>
    );
  }

  return (
    <button 
      className={buttonClasses} 
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      aria-pressed={ariaPressed}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
