import React, { forwardRef } from 'react';
import '../../styles/style.css'; // Ensure styles are available

const Button = forwardRef(({
    children,
    variant = 'primary', // primary, secondary, outline, ghost
    size = 'md', // sm, md, lg
    className = '',
    isLoading = false,
    disabled,
    type = 'button',
    onClick,
    'aria-label': ariaLabel,
    ...props
}, ref) => {

    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    const sizeClass = size === 'md' ? '' : `btn-${size}`;
    const loadingClass = isLoading ? 'loading' : '';

    const combinedClassName = [baseClass, variantClass, sizeClass, loadingClass, className].filter(Boolean).join(' ');

    return (
        <button
            ref={ref}
            type={type}
            className={combinedClassName}
            disabled={disabled || isLoading}
            onClick={onClick}
            aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
            aria-busy={isLoading}
            data-variant={variant}
            {...props}
        >
            {isLoading ? (
                <span className="spinner" aria-hidden="true">⏳</span>
            ) : null}
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;
