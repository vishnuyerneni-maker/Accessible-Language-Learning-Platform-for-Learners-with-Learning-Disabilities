import React, { forwardRef, useId } from 'react';
import '../../styles/style.css';

const Input = forwardRef(({
    label,
    error,
    type = 'text',
    className = '',
    containerClassName = '',
    id,
    helperText,
    required,
    ...props
}, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
        <div className={`input-group ${containerClassName}`}>
            {label && (
                <label htmlFor={inputId}>
                    {label}
                    {required && <span className="text-error" aria-hidden="true">*</span>}
                </label>
            )}
            <input
                ref={ref}
                id={inputId}
                type={type}
                className={`${className} ${error ? 'input-error' : ''}`}
                aria-invalid={!!error}
                aria-describedby={
                    [error ? errorId : '', helperText ? helperId : ''].filter(Boolean).join(' ') || undefined
                }
                required={required}
                {...props}
            />
            {helperText && !error && (
                <p id={helperId} className="input-helper">
                    {helperText}
                </p>
            )}
            {error && (
                <p id={errorId} className="input-error-message" role="alert" style={{ color: 'var(--error-color)' }}>
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
