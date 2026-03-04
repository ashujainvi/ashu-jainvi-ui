import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './GlassButton.module.css';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: string;
}

const GlassButton = ({
  children,
  size,
  className = '',
  style,
  ...props
}: GlassButtonProps) => {
  const buttonStyle = size
    ? { ...style, '--glass-button-size': size } as React.CSSProperties
    : style;

  return (
    <button
      className={`${styles.glassButton} ${className}`.trim()}
      style={buttonStyle}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};

export default GlassButton;
