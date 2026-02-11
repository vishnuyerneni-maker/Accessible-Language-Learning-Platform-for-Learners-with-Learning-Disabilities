const API_URL = 'http://localhost:5000/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'x-auth-token': token } : {})
    };
};

export const api = {
    // Auth
    login: async (username, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    },

    register: async (userData) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration failed');
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('app_current_session'); // clear legacy if exists
    },

    getCurrentUser: async () => {
        const res = await fetch(`${API_URL}/users/me`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
    },

    getAllUsers: async () => {
        const res = await fetch(`${API_URL}/users`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
    },

    getSystemAnalytics: async () => {
        const res = await fetch(`${API_URL}/users/analytics`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch analytics');
        return res.json();
    },

    // Courses
    getCourses: async () => {
        const res = await fetch(`${API_URL}/courses`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch courses');
        return res.json();
    },

    createCourse: async (courseData) => {
        const res = await fetch(`${API_URL}/courses`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(courseData)
        });
        if (!res.ok) throw new Error('Failed to create course');
        return res.json();
    },

    updateCourse: async (id, courseData) => {
        const res = await fetch(`${API_URL}/courses/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(courseData)
        });
        if (!res.ok) throw new Error('Failed to update course');
        return res.json();
    },



    deleteCourse: async (id) => {
        const res = await fetch(`${API_URL}/courses/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to delete course');
        return res.json();
    },

    updateProgress: async (courseId, percent) => {
        const res = await fetch(`${API_URL}/users/progress`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ courseId, percent })
        });
        if (!res.ok) throw new Error('Failed to update progress');
        return res.json();
    },

    // Parent
    getChildProgress: async () => {
        const res = await fetch(`${API_URL}/users/child-progress`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch child progress');
        return res.json();
    },

    // MFA
    verifyMfaLogin: async (userId, code) => {
        const res = await fetch(`${API_URL}/auth/login/mfa`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, code })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Verification failed');
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    },

    generateMfaSecret: async () => {
        const res = await fetch(`${API_URL}/auth/mfa/generate`, {
            method: 'POST',
            headers: getHeaders()
        });
        return res.json();
    },

    enableMfa: async (userId, secret, code) => {
        const res = await fetch(`${API_URL}/auth/mfa/enable`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ userId, secret, code })
        });
        return res.json();
    },

    disableMfa: async (userId) => {
        const res = await fetch(`${API_URL}/auth/mfa/disable`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ userId })
        });
        return res.json();
    }
};
