import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '../components/common/Button';

describe('Button Component', () => {
    it('renders children correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('handles onClick events', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click me</Button>);
        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies variant classes', () => {
        const { container } = render(<Button variant="secondary">Secondary</Button>);
        expect(container.firstChild).toHaveClass('btn-secondary');
    });

    it('applies size classes', () => {
        const { container } = render(<Button size="lg">Large</Button>);
        expect(container.firstChild).toHaveClass('btn-lg');
    });

    it('renders loading state', () => {
        render(<Button isLoading>Loading</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
        expect(screen.getByText('⏳')).toBeInTheDocument();
    });

    it('respects disabled prop', () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('sets aria-label when provided', () => {
        render(<Button aria-label="Custom Label">Icon</Button>);
        expect(screen.getByLabelText('Custom Label')).toBeInTheDocument();
    });
});
