import type { ReactNode, ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  as?: 'button' | 'a';
  href?: string;
}

const Button = ({ 
  children, 
  variant = 'primary', 
  as = 'button',
  href,
  className = '',
  ...props 
}: ButtonProps) => {
  const buttonClasses = `${styles.button} ${styles[variant]} ${className}`.trim();

  if (as === 'a' && href) {
    return (
      <a href={href} className={buttonClasses} role="button">
        {children}
      </a>
    );
  }

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
