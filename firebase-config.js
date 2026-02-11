/**
 * Firebase Configuration and Initialization
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project or select existing one
 * 3. Go to Project Settings > Your apps > Web app
 * 4. Copy your Firebase config and replace the values below
 */

// TODO: Replace these values with your actual Firebase configuration
// Get this from Firebase Console > Project Settings > Your apps
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
let app, auth, db;

try {
    // Import Firebase modules from CDN
    // These are loaded via script tags in HTML files

    // Initialize Firebase App
    app = firebase.initializeApp(firebaseConfig);

    // Initialize Firebase  Authentication
    auth = firebase.auth();

    // Initialize Firestore Database
    db = firebase.firestore();

    console.log('✅ Firebase initialized successfully');
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
}

// Export for use in other files
const FirebaseApp = {
    app,
    auth,
    db,

    // Helper to check if Firebase is configured
    isConfigured() {
        return firebaseConfig.apiKey !== "YOUR_API_KEY_HERE";
    },

    // Helper to get current timestamp
    timestamp() {
        return firebase.firestore.FieldValue.serverTimestamp();
     },

    // Helper to get current user
    getCurrentUser() {
        return auth.currentUser;
     }
};

// Make available globally
window.FirebaseApp = FirebaseApp;

