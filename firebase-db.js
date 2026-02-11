/**
 * Firebase Database Service
 * Handles all Firestore database operations for user progress, courses, and activities
 */

const FirebaseDB = {
    /**
     * Save or update user progress (XP, level, badges, streak)
     */
    async saveUserProgress(progressData) {
        const user = FirebaseApp.getCurrentUser();
        if (!user) {
            console.error('No user logged in');
            return { success: false };
        }

        try {
            await FirebaseApp.db.collection('userProgress').doc(user.uid).set(progressData, { merge: true });
            return { success: true };
        } catch (error) {
            console.error('Error saving progress:', error);
            return { success: false, error };
        }
    },

    /**
     * Get user progress data
     */
    async getUserProgress() {
        const user = FirebaseApp.getCurrentUser();
        if (!user) return null;

        try {
            const doc = await FirebaseApp.db.collection('userProgress').doc(user.uid).get();
            return doc.exists ? doc.data() : null;
        } catch (error) {
            console.error('Error getting progress:', error);
            return null;
        }
    },

    /**
     * Award XP to user
     */
    async awardXP(amount, reason) {
        const user = FirebaseApp.getCurrentUser();
        if (!user) return { success: false };

        try {
            const progressRef = FirebaseApp.db.collection('userProgress').doc(user.uid);
            const doc = await progressRef.get();
            const currentData = doc.data() || { xp: 0, level: 1 };

            const newXP = (currentData.xp || 0) + amount;
            const newLevel = Math.floor(newXP / 100) + 1;

            await progressRef.update({
                xp: newXP,
                level: newLevel
            });

            // Log activity
            await this.logActivity({
                type: 'xp',
                text: `Earned ${amount} XP: ${reason}`,
                xpGained: amount
            });

            return { success: true, newXP, newLevel };
        } catch (error) {
            console.error('Error awarding XP:', error);
            return { success: false, error };
        }
    },

    /**
     * Award badge to user
     */
    async awardBadge(badgeId, badgeName, badgeIcon) {
        const user = FirebaseApp.getCurrentUser();
        if (!user) return { success: false };

        try {
            const progressRef = FirebaseApp.db.collection('userProgress').doc(user.uid);
            const doc = await progressRef.get();
            const badges = doc.data()?.badges || [];

            // Check if badge already earned
            if (badges.includes(badgeId)) {
                return { success: false, alreadyEarned: true };
            }

            // Add badge
            await progressRef.update({
                badges: firebase.firestore.FieldValue.arrayUnion(badgeId)
            });

            // Log activity
            await this.logActivity({
                type: 'badge',
                text: `Earned badge: ${badgeName}`,
                badgeId,
                badgeName,
                badgeIcon
            });

            return { success: true };
        } catch (error) {
            console.error('Error awarding badge:', error);
            return { success: false, error };
        }
    },

    /**
     * Save course progress
     */
    async saveCourseProgress(courseId, lessonId, progress) {
        const user = FirebaseApp.getCurrentUser();
        if (!user) return { success: false };

        try {
            const docRef = FirebaseApp.db.collection('courseProgress').doc(`${user.uid}_${courseId}`);

            await docRef.set({
                userId: user.uid,
                courseId: courseId,
                currentLesson: lessonId,
                progress: progress,
                lastAccessed: FirebaseApp.timestamp()
            }, { merge: true });

            return { success: true };
        } catch (error) {
            console.error('Error saving course progress:', error);
            return { success: false, error };
        }
    },

    /**
     * Mark lesson as completed
     */
    async markLessonComplete(courseId, lessonId) {
        const user = FirebaseApp.getCurrentUser();
        if (!user) return { success: false };

        try {
            const docRef = FirebaseApp.db.collection('courseProgress').doc(`${user.uid}_${courseId}`);

            await docRef.update({
                completedLessons: firebase.firestore.FieldValue.arrayUnion(lessonId),
                lastAccessed: FirebaseApp.timestamp()
            });

            return { success: true };
        } catch (error) {
            console.error('Error marking lesson complete:', error);
            return { success: false, error };
        }
    },

    /**
     * Save quiz score
     */
    async saveQuizScore(courseId, quizId, score) {
        const user = FirebaseApp.getCurrentUser();
        if (!user) return { success: false };

        try {
            const docRef = FirebaseApp.db.collection('quizScores').doc(`${user.uid}_${courseId}_${quizId}`);

            await docRef.set({
                userId: user.uid,
                courseId: courseId,
                quizId: quizId,
                score: score,
                completedAt: FirebaseApp.timestamp()
            });

            return { success: true };
        } catch (error) {
            console.error('Error saving quiz score:', error);
            return { success: false, error };
        }
    },

    /**
     * Save speech practice attempt
     */
    async saveSpeechPractice(sentenceId, accuracy, transcript) {
        const user = FirebaseApp.getCurrentUser();
        if (!user) return { success: false };

        try {
            await FirebaseApp.db.collection('speechPractice').add({
                userId: user.uid,
                sentenceId: sentenceId,
                accuracy: accuracy,
                transcript: transcript,
                timestamp: FirebaseApp.timestamp()
            });

            return { success: true };
        } catch (error) {
            console.error('Error saving speech practice:', error);
            return { success: false, error };
        }
    },

    /**
     * Log user activity
     */
    async logActivity(activity) {
        const user = FirebaseApp.getCurrentUser();
        if (!user) return { success: false };

        try {
            await FirebaseApp.db.collection('activities').add({
                userId: user.uid,
                ...activity,
                timestamp: FirebaseApp.timestamp(),
                time: new Date().toLocaleString()
            });

            return { success: true };
        } catch (error) {
            console.error('Error logging activity:', error);
            return { success: false, error };
        }
    },

    /**
     * Get recent activities
     */
    async getRecentActivities(limit = 10) {
        const user = FirebaseApp.getCurrentUser();
        if (!user) return [];

        try {
            const snapshot = await FirebaseApp.db.collection('activities')
                .where('userId', '==', user.uid)
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();

            return snapshot.docs.map(doc => doc.data());
        } catch (error) {
            console.error('Error getting activities:', error);
            return [];
        }
    },

    /**
     * Update daily streak
     */
    async updateStreak() {
        const user = FirebaseApp.getCurrentUser();
        if (!user) return { success: false };

        try {
            const progressRef = FirebaseApp.db.collection('userProgress').doc(user.uid);
            const doc = await progressRef.get();
            const data = doc.data() || {};

            const today = new Date().toISOString().split('T')[0];
            const lastActivity = data.lastActivityDate;

            let newStreak = data.currentStreak || 0;

            if (lastActivity !== today) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                if (lastActivity === yesterdayStr) {
                    // Consecutive day
                    newStreak++;
                } else {
                    // Streak broken
                    newStreak = 1;
                }

                await progressRef.update({
                    currentStreak: newStreak,
                    longestStreak: Math.max(newStreak, data.longestStreak || 0),
                    lastActivityDate: today
                });
            }

            return { success: true, streak: newStreak };
        } catch (error) {
            console.error('Error updating streak:', error);
            return { success: false, error };
        }
    }
};

// Make available globally
window.FirebaseDB = FirebaseDB;
