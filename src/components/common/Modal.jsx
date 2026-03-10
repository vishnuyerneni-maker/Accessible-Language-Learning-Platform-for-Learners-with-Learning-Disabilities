import React, { useEffect, useRef } from 'react';
import '../../styles/style.css';

const Modal = ({ isOpen, onClose, title, children, footer }) => {
    const modalRef = useRef(null);
    const previousFocus = useRef(null);

    useEffect(() => {
        if (isOpen) {
            previousFocus.current = document.activeElement;
            // Focus the modal or the first focusable element
            const focusableElements = modalRef.current?.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusableElements && focusableElements.length > 0) {
                focusableElements[0].focus();
            } else {
                modalRef.current?.focus();
            }

            const handleKeyDown = (e) => {
                if (e.key === 'Escape') {
                    onClose();
                }

                if (e.key === 'Tab') {
                    if (!modalRef.current) return;

                    const focusable = modalRef.current.querySelectorAll(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );

                    if (focusable.length === 0) return;

                    const firstElement = focusable[0];
                    const lastElement = focusable[focusable.length - 1];

                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            };

            document.addEventListener('keydown', handleKeyDown);
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
                // Restore focus
                if (previousFocus.current) {
                    previousFocus.current.focus();
                }
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content animate-scale-in"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                ref={modalRef}
                tabIndex={-1}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h3 id="modal-title" className="modal-title">{title}</h3>
                    <button
                        className="btn-close"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                {footer && (
                    <div className="modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
