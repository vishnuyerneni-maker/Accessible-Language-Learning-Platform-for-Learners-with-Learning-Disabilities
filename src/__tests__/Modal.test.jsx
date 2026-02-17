import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Modal from '../components/common/Modal';

describe('Modal Component', () => {
    it('renders content when open', () => {
        render(
            <Modal isOpen={true} onClose={() => { }} title="Test Modal">
                <p>Modal Content</p>
            </Modal>
        );
        expect(screen.getByText('Test Modal')).toBeInTheDocument();
        expect(screen.getByText('Modal Content')).toBeInTheDocument();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
        render(
            <Modal isOpen={false} onClose={() => { }} title="Test Modal">
                <p>Modal Content</p>
            </Modal>
        );
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        const handleClose = vi.fn();
        render(
            <Modal isOpen={true} onClose={handleClose} title="Test Modal">
                <p>Modal Content</p>
            </Modal>
        );
        fireEvent.click(screen.getByLabelText('Close modal'));
        expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when overlay is clicked', () => {
        const handleClose = vi.fn();
        render(
            <Modal isOpen={true} onClose={handleClose} title="Test Modal">
                <p>Modal Content</p>
            </Modal>
        );
        // The overlay is the outer container
        const overlay = screen.getByRole('dialog').parentElement;
        fireEvent.click(overlay);
        expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when content is clicked', () => {
        const handleClose = vi.fn();
        render(
            <Modal isOpen={true} onClose={handleClose} title="Test Modal">
                <p>Modal Content</p>
            </Modal>
        );
        fireEvent.click(screen.getByRole('dialog'));
        expect(handleClose).not.toHaveBeenCalled();
    });

    it('calls onClose when Escape key is pressed', () => {
        const handleClose = vi.fn();
        render(
            <Modal isOpen={true} onClose={handleClose} title="Test Modal">
                <p>Modal Content</p>
            </Modal>
        );
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(handleClose).toHaveBeenCalledTimes(1);
    });
});
