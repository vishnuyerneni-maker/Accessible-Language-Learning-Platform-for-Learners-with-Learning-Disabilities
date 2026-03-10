import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Landing from '../pages/Landing';
import { BrowserRouter } from 'react-router-dom';
import { api } from '../services/api';

// Mock API
vi.mock('../services/api', () => ({
    api: {
        login: vi.fn(),
        verifyMfaLogin: vi.fn()
    }
}));

// Mock Layout to avoid complex rendering and context issues
vi.mock('../components/Layout', () => ({
    default: ({ children }) => <div data-testid="layout">{children}</div>
}));

// Mock i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key,
        i18n: {
            changeLanguage: () => new Promise(() => { }),
        },
    }),
    Trans: ({ i18nKey }) => <span data-testid="trans">{i18nKey}</span>,
    initReactI18next: {
        type: '3rdParty',
        init: () => { },
    }
}));

describe('Landing Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders login form by default', () => {
        render(
            <BrowserRouter>
                <Landing />
            </BrowserRouter>
        );

        expect(screen.getByLabelText(/landing.login.username_label/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/landing.login.password_label/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /landing.login.submit/i })).toBeInTheDocument();
    });

    it('handles successful login redirect', async () => {
        // Mock window.location
        delete window.location;
        window.location = { href: '' };

        api.login.mockResolvedValue({
            user: { role: 'student' },
            requiresMfa: false
        });

        render(
            <BrowserRouter>
                <Landing />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/landing.login.username_label/i), { target: { value: 'student' } });
        fireEvent.change(screen.getByLabelText(/landing.login.password_label/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /landing.login.submit/i }));

        await waitFor(() => {
            expect(window.location.href).toBe('/dashboard');
        });
    });

    it('displays error on login failure', async () => {
        api.login.mockRejectedValue(new Error('Invalid credentials'));

        render(
            <BrowserRouter>
                <Landing />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/landing.login.username_label/i), { target: { value: 'student' } });
        fireEvent.change(screen.getByLabelText(/landing.login.password_label/i), { target: { value: 'wrongpass' } });
        fireEvent.click(screen.getByRole('button', { name: /landing.login.submit/i }));

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
    });

    it('switches to MFA step when required', async () => {
        api.login.mockResolvedValue({
            userId: '123',
            requiresMfa: true
        });

        render(
            <BrowserRouter>
                <Landing />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/landing.login.username_label/i), { target: { value: 'student' } });
        fireEvent.change(screen.getByLabelText(/landing.login.password_label/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /landing.login.submit/i }));

        await waitFor(() => {
            expect(screen.getByLabelText(/landing.mfa.label/i)).toBeInTheDocument();
        });
    });
});
