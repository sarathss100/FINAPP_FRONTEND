import React from 'react';
import cn from '../../lib/utils';

const baseStyles = "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

export const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
};

const sizeStyles = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4",
  lg: "h-12 px-6 text-base",
};

// Props for the button
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof variantStyles; // 'primary', 'secondary', 'outline'
    size?: keyof typeof sizeStyles; // 'sm', 'md', 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                className={cn(
                    baseStyles,
                    variantStyles[variant],
                    sizeStyles[size],
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)

Button.displayName = 'Button';

export default Button;
