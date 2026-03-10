import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import DashboardHome from './DashboardHome';
import { BrowserRouter } from 'react-router-dom';

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        user: {
            name: 'Testy McTestface',
            gamification: { xp: 1500, level: 2, currentStreak: 5, badges: [] },
            progress: {}
        }
    })
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({ 
        t: (key, options) => {
            if (key === 'studentDashboard.welcome') return `Welcome back, Testy 👋`;
            if (key === 'studentDashboard.dayStreak') return `5 Day Streak 🔥`;
            if (key === 'studentDashboard.xpToNextLevel') return `500 XP to Level 3`;
            return key;
        }
    })
}));

// Mock DashboardLayout to just render children
vi.mock('../components/DashboardLayout', () => ({
    __esModule: true,
    default: ({ children }) => <div data-testid="dashboard-layout">{children}</div>
}));

// Mock api.js
vi.mock('../utils/api', () => ({
    courseAPI: {
        getAll: vi.fn().mockResolvedValue({ data: [] })
    },
    announcementAPI: {
        getAll: vi.fn().mockResolvedValue({ data: [] })
    }
}));

describe('DashboardHome Integration Test', () => {
    it('renders the welcome message with user name', async () => {
        render(
            <BrowserRouter>
                <DashboardHome />
            </BrowserRouter>
        );
        
        // It should display 'Welcome back, Testy'
        expect(await screen.findByText(/Welcome back, Testy/i)).toBeInTheDocument();
    });

    it('renders user gamification stats correctly', async () => {
        render(
            <BrowserRouter>
                <DashboardHome />
            </BrowserRouter>
        );
        
        // XP: 1,500 appears in multiple places
        const xpElements = await screen.findAllByText(/1,500/i);
        expect(xpElements.length).toBeGreaterThan(0);
        
        // Level: 2
        expect(await screen.findByText('2')).toBeInTheDocument();
        // Streak: 5
        expect(await screen.findByText(/5 Day Streak/i)).toBeInTheDocument();
    });
});
