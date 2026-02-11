/**
 * Firebase Authentication Service
 * Handles user registration, login, logout, and session management
 */

const FirebaseAuth = {
    /**
     * Register a new user with email and password
     */
    async register(email, password, username, name) {
        try {
            // Create user account
            const userCredential = await FirebaseApp.auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Update display name
            await user.updateProfile({
                displayName: username
            });

            // Create user document in Firestore
            await FirebaseApp.db.collection('users').doc(user.uid).set({
                uid: user.uid,
                email: email,
                username: username,
                name: name,
                createdAt: FirebaseApp.timestamp(),
                lastLogin: FirebaseApp.timestamp()
            });

            // Initialize user progress
            await FirebaseApp.db.collection('userProgress').doc(user.uid).set({
                userId: user.uid,
                xp: 0,
                level: 1,
                currentStreak: 0,
                longestStreak: 0,
                badges: [],
                lastActivityDate: new Date().toISOString().split('T')[0]
            });

            showToast('✅ Account created successfully! Welcome to AccessLearn!');
            return { success: true, user };

        } catch (error) {
            console.error('Registration error:', error);
            let message = 'Registration failed. Please try again.';

            if (error.code === 'auth/email-already-in-use') {
                message = 'This email is already registered. Please login instead.';
            } else if (error.code === 'auth/weak-password') {
                message = 'Password should be at least 6 characters.';
            } else if (error.code === 'auth/invalid-email') {
                message = 'Invalid email address.';
            }

            showToast('❌ ' + message);
            return { success: false, error: message };
        }
    },

    /**
     * Login with email and password
     */
    async login(email, password) {
        try {
            const userCredential = await FirebaseApp.auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Update last login time
            await FirebaseApp.db.collection('users').doc(user.uid).update({
                lastLogin: FirebaseApp.timestamp()
            });

            showToast('✅ Welcome back!');
            return { success: true, user };

        } catch (error) {
            console.error('Login error:', error);
            let message = 'Login failed. Please check your credentials.';

            if (error.code === 'auth/user-not-found') {
                message = 'No account found with this email.';
            } else if (error.code === 'auth/wrong-password') {
                message = 'Incorrect password.';
            } else if (error.code === 'auth/invalid-email') {
                message = 'Invalid email address.';
            }

            showToast('❌ ' + message);
            return { success: false, error: message };
        }
    },

    /**
     * Logout current user
     */
    async logout() {
        try {
            await FirebaseApp.auth.signOut();
            showToast('✅ Logged out successfully');
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            showToast('❌ Logout failed');
            return { success: false, error: error.message };
        }
    },

    /**
     * Send password reset email
     */
    async resetPassword(email) {
        try {
            await FirebaseApp.auth.sendPasswordResetEmail(email);
            showToast('✅ Password reset email sent! Check your inbox.');
            return { success: true };
        } catch (error) {
            console.error('Password reset error:', error);
            showToast('❌ Failed to send reset email');
            return { success: false, error: error.message };
        }
    },

    /**
     * Get current user data from Firestore
     */
    async getCurrentUserData() {
        const user = FirebaseApp.getCurrentUser();
        if (!user) return null;

        try {
            const userDoc = await FirebaseApp.db.collection('users').doc(user.uid).get();
            const progressDoc = await FirebaseApp.db.collection('userProgress').doc(user.uid).get();

            return {
                ...userDoc.data(),
                gamification: progressDoc.data()
            };
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    },

    /**
     * Listen to authentication state changes
     */
    onAuthStateChanged(callback) {
        return FirebaseApp.auth.onAuthStateChanged(callback);
    }
};

// Make available globally
window.FirebaseAuth = FirebaseAuth;
