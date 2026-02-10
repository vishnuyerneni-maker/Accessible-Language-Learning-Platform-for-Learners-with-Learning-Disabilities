/**
 * OAuth Authentication Configuration
 * Supports Microsoft Azure AD and Google Sign-In
 * 
 * SETUP INSTRUCTIONS:
 * 1. Microsoft: Create app in Azure AD (https://portal.azure.com)
 *    - Register application, get Client ID
 *    - Add redirect URI: http://localhost:8000/index.html (or your domain)
 * 2. Google: Create project in Google Cloud Console (https://console.cloud.google.com)
 *    - Enable Google+ API, get Client ID
 *    - Add authorized JavaScript origin: http://localhost:8000
 */

// ============================================
// CONFIGURATION - REPLACE WITH YOUR CREDENTIALS
// ============================================
const AUTH_CONFIG = {
    microsoft: {
        clientId: 'YOUR_MICROSOFT_CLIENT_ID', // Replace with your Azure AD app Client ID
        authority: 'https://login.microsoftonline.com/common',
        redirectUri: window.location.origin + '/index.html',
        scopes: ['user.read', 'profile', 'openid', 'email']
    },
    google: {
        clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com', // Replace with your Google Client ID
        scope: 'profile email',
        hosted_domain: '' // Optional: restrict to specific domain
    }
};

// ============================================
// MICROSOFT AUTHENTICATION (MSAL.js)
// ============================================
class MicrosoftAuth {
    constructor() {
        // MSAL will be loaded from CDN in HTML
        this.msalInstance = null;
        this.initializeMSAL();
    }

    initializeMSAL() {
        if (typeof msal === 'undefined') {
            console.warn('MSAL library not loaded. Include it in your HTML.');
            return;
        }

        const msalConfig = {
            auth: {
                clientId: AUTH_CONFIG.microsoft.clientId,
                authority: AUTH_CONFIG.microsoft.authority,
                redirectUri: AUTH_CONFIG.microsoft.redirectUri,
            },
            cache: {
                cacheLocation: 'localStorage',
                storeAuthStateInCookie: true
            }
        };

        try {
            this.msalInstance = new msal.PublicClientApplication(msalConfig);
        } catch (error) {
            console.error('MSAL initialization failed:', error);
        }
    }

    async login() {
        if (!this.msalInstance) {
            showToast('Microsoft authentication not configured');
            return null;
        }

        const loginRequest = {
            scopes: AUTH_CONFIG.microsoft.scopes
        };

        try {
            const loginResponse = await this.msalInstance.loginPopup(loginRequest);
            const userProfile = await this.getUserProfile(loginResponse.accessToken);
            
            return {
                provider: 'microsoft',
                id: loginResponse.uniqueId,
                email: loginResponse.account.username,
                name: loginResponse.account.name,
                token: loginResponse.accessToken,
                profile: userProfile
            };
        } catch (error) {
            console.error('Microsoft login failed:', error);
            showToast('Microsoft login failed. Please try again.');
            return null;
        }
    }

    async getUserProfile(accessToken) {
        try {
            const response = await fetch('https://graph.microsoft.com/v1.0/me', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            return {};
        }
    }

    async logout() {
        if (this.msalInstance) {
            await this.msalInstance.logoutPopup();
        }
    }
}

// ============================================
// GOOGLE AUTHENTICATION (Google Sign-In)
// ============================================
class GoogleAuth {
    constructor() {
        this.isInitialized = false;
        this.initializeGoogle();
    }

    initializeGoogle() {
        if (typeof google === 'undefined' || !google.accounts) {
            console.warn('Google Sign-In library not loaded. Include it in your HTML.');
            return;
        }

        google.accounts.id.initialize({
            client_id: AUTH_CONFIG.google.clientId,
            callback: this.handleCredentialResponse.bind(this),
            auto_select: false
        });

        this.isInitialized = true;
    }

    async login() {
        return new Promise((resolve, reject) => {
            if (!this.isInitialized) {
                showToast('Google authentication not configured');
                reject('Not initialized');
                return;
            }

            // Store resolve/reject for callback
            window._googleAuthResolve = resolve;
            window._googleAuthReject = reject;

            // Trigger sign-in popup
            google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    // Try alternative method
                    this.showOneTap();
                }
            });
        });
    }

    showOneTap() {
        if (this.isInitialized) {
            google.accounts.id.prompt();
        }
    }

    async handleCredentialResponse(response) {
        try {
            // Decode JWT token
            const credential = this.parseJwt(response.credential);
            
            const userData = {
                provider: 'google',
                id: credential.sub,
                email: credential.email,
                name: credential.name,
                picture: credential.picture,
                token: response.credential
            };

            if (window._googleAuthResolve) {
                window._googleAuthResolve(userData);
            }

            return userData;
        } catch (error) {
            console.error('Google authentication failed:', error);
            if (window._googleAuthReject) {
                window._googleAuthReject(error);
            }
            showToast('Google login failed. Please try again.');
            return null;
        }
    }

    parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    renderButton(elementId) {
        if (this.isInitialized) {
            google.accounts.id.renderButton(
                document.getElementById(elementId),
                { 
                    theme: 'filled_blue', 
                    size: 'large',
                    text: 'signin_with',
                    width: 250
                }
            );
        }
    }

    logout() {
        if (this.isInitialized) {
            google.accounts.id.disableAutoSelect();
        }
    }
}

// ============================================
// UNIFIED AUTH MANAGER
// ============================================
const AuthManager = {
    microsoftAuth: null,
    googleAuth: null,

    init() {
        this.microsoftAuth = new MicrosoftAuth();
        this.googleAuth = new GoogleAuth();
    },

    async loginWithMicrosoft() {
        const userData = await this.microsoftAuth.login();
        if (userData) {
            return this.handleOAuthLogin(userData);
        }
        return false;
    },

    async loginWithGoogle() {
        try {
            const userData = await this.googleAuth.login();
            if (userData) {
                return this.handleOAuthLogin(userData);
            }
        } catch (error) {
            console.error('Google login error:', error);
        }
        return false;
    },

    handleOAuthLogin(userData) {
        // Check if user exists in MockBackend
        let user = MockBackend.findUserByEmail(userData.email);

        if (!user) {
            // Create new user from OAuth data
            user = MockBackend.createOAuthUser(userData);
        } else {
            // Update OAuth info for existing user
            user.oauthProvider = userData.provider;
            user.oauthId = userData.id;
            user.profilePicture = userData.picture || userData.profile?.picture;
        }

        // Set session
        localStorage.setItem('app_current_session', JSON.stringify(user));
        MockBackend.saveUser(user);

        showToast(`Welcome, ${user.name}!`);

        // Redirect based on role
        if (user.role === 'parent') {
            window.location.href = 'parent_dashboard.html';
        } else {
            window.location.href = 'dashboard.html';
        }

        return true;
    },

    async logout() {
        const user = MockBackend.getCurrentUser();
        
        if (user && user.oauthProvider === 'microsoft') {
            await this.microsoftAuth.logout();
        } else if (user && user.oauthProvider === 'google') {
            this.googleAuth.logout();
        }

        MockBackend.logout();
        window.location.href = 'index.html';
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    AuthManager.init();
});
