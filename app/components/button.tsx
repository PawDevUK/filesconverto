// components/ui/button.tsx
import { ButtonHTMLAttributes, FC } from 'react';


type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost';
};

export const Button: FC<ButtonProps> = ({
  children,
  className,
  variant = 'default',
  ...props
}) => {
  const baseStyles = 'px-4 py-2 rounded font-medium transition focus:outline-none focus:ring-2';
  const variantStyles = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-300',
    ghost: 'text-blue-600 hover:bg-blue-100 focus:ring-blue-300',
  };

  return (
    <button
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
