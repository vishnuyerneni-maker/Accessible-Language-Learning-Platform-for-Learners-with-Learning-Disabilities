import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Input from '../components/common/Input';

describe('Input Component', () => {
    it('renders with label', () => {
        render(<Input label="Username" id="user" onChange={() => { }} />);
        expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });

    it('handles change events', () => {
        const handleChange = vi.fn();
        render(<Input label="Username" id="user" onChange={handleChange} />);
        const input = screen.getByLabelText('Username');
        fireEvent.change(input, { target: { value: 'test' } });
        expect(handleChange).toHaveBeenCalled();
    });

    it('displays error message and sets aria-invalid', () => {
        render(
            <Input
                label="Username"
                id="user"
                error="Invalid username"
                onChange={() => { }}
            />
        );
        const input = screen.getByLabelText('Username');
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByText('Invalid username')).toBeInTheDocument();
        expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('user-error'));
    });

    it('displays helper text', () => {
        render(
            <Input
                label="Username"
                id="user"
                helperText="Enter your unique username"
                onChange={() => { }}
            />
        );
        expect(screen.getByText('Enter your unique username')).toBeInTheDocument();
    });

    it('marks required inputs', () => {
        render(<Input label="Username" id="user" required onChange={() => { }} />);
        expect(screen.getByRole('textbox')).toBeRequired();
    });
});
