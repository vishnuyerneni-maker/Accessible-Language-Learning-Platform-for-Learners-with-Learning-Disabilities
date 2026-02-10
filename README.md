# 🎓 AccessLearn - Accessible Language Learning Platform

## ✨ New Features & Extraordinary UI

### 🎨 Modern Design
- **Beautiful Gradient Themes**: Purple/blue gradients with glassmorphism effects
- **Smooth Animations**: Fade-in, slide-in, scale, and celebration animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Mode**: Elegant dark theme with animated gradients
- **High Contrast Mode**: Enhanced accessibility for visual impairments

### 🎮 Gamification System
- **XP System**: Earn experience points for every activity
- **8 Levels**: Progress from Beginner → Learner → Student → Scholar → Expert → Master → Guru → Legend
- **Daily Streaks**: Build consecutive learning streaks with fire emoji animations
- **8 Unique Badges**: Earn badges for achievements
- **Activity Feed**: Track all your learning activities in real-time
- **Progress Visualization**: Beautiful animated progress bars

### 🔐 OAuth Authentication
- **Microsoft Sign-In**: Azure AD integration
- **Google Sign-In**: OAuth 2.0 integration
- **Auto Account Creation**: Seamlessly creates accounts from OAuth data
- **Profile Pictures**: Displays OAuth profile pictures

### 🚀 Enhanced Features
- **AI-Powered Quizzes**: Dynamic question generation with Gemini AI
- **Text-to-Speech**: Read aloud functionality
- **Dyslexia-Friendly Fonts**: Accessible typography
- **Parent Dashboard**: Monitor child's progress
- **Real-time Stats**: XP, Level, Streak, and Badges displayed beautifully

---

## 🚀 Quick Start (Without OAuth)

### 1. Open the Application
Simply open `index.html` in a modern web browser:

```powershell
# Navigate to the folder
cd "C:\Users\sathwik\OneDrive\Desktop\SE\SE"

# Open in default browser
start index.html

# OR open in specific browser
start chrome index.html
start msedge index.html
```

### 2. Login with Demo Account
Use the traditional email/password login:
- **Username**: `student`
- **Password**: `password123`

### 3. Explore the Dashboard
You'll see:
- 🎯 XP and Level stats with gradient cards
- 🔥 Daily streak counter
- 🏆 Earned badges section
- 📊 Beautiful course cards with progress bars
- 📈 Activity feed with all your actions

---

## 🔧 OAuth Setup (Optional - For Production)

To enable Microsoft and Google authentication:

### Microsoft Azure AD Setup

1. **Go to Azure Portal**: https://portal.azure.com
2. **Register App**:
   - Navigate to: Azure Active Directory → App registrations → New registration
   - Name: AccessLearn
   - Supported account types: Accounts in any organizational directory and personal Microsoft accounts
   - Redirect URI: `http://localhost:8000/index.html` (for testing)
3. **Get Client ID**:
   - Copy the "Application (client) ID" from the Overview page
4. **Configure auth-config.js**:
   ```javascript
   microsoft: {
       clientId: 'YOUR_CLIENT_ID_HERE', // Paste your Client ID
       //...
   }
   ```

### Google Cloud Setup

1. **Go to Google Cloud Console**: https://console.cloud.google.com
2. **Create Project**: Create a new project or select existing
3. **Enable Google+ API**:
   - APIs & Services → Enable APIs and Services
   - Search for "Google+ API" → Enable
4. **Create OAuth Client**:
   - APIs & Services → Credentials → Create Credentials → OAuth client ID
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:8000`
5. **Get Client ID**:
   - Copy the Client ID
6. **Configure auth-config.js**:
   ```javascript
   google: {
       clientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
       //...
   }
   ```

### Test OAuth Locally

For OAuth to work, you need to serve the files over HTTP:

```powershell
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js (if you have http-server)
npx http-server -p 8000

# Then open: http://localhost:8000/index.html
```

---

## 🎮 How to Use Gamification

### Earning XP
- **Daily Login**: +25 XP
- **Complete Lesson**: +50 XP (First lesson: +100 XP bonus!)
- **Pass Quiz (50%+)**: +50 XP
- **Perfect Quiz (100%)**: +100 XP
- **Streak Milestones**: +50 XP every 7 days
- **Complete Course**: +200 XP bonus

### Leveling Up
- Level 1 (Beginner): 0 XP
- Level 2 (Learner): 100 XP
- Level 3 (Student): 300 XP
- Level 4 (Scholar): 600 XP
- Level 5 (Expert): 1,000 XP
- Level 6 (Master): 1,500 XP
- Level 7 (Guru): 2,200 XP
- Level 8 (Legend): 3,000 XP

### Earning Badges
1. 🎯 **First Steps**: Complete your first lesson
2. 💯 **Perfect Score**: Get 100% on a quiz
3. 🔥 **Getting Started**: Maintain a 3-day streak
4. ⚡ **Week Warrior**: Maintain a 7-day streak
5. 🏆 **Monthly Master**: Maintain a 30-day streak
6. 🎓 **Course Champion**: Complete an entire course
7. 📚 **Dedicated Learner**: Complete 5 courses
8. ⚡ **Speed Demon**: Complete 3 lessons in one day

---

## 🎨 Accessibility Features

### Theme Switching
- **Light Mode**: Default, comfortable for most users
- **Dark Mode**: Reduces eye strain in low light
- **High Contrast**: Maximum accessibility for visual impairments

### Font Options
- **Standard Fonts**: Inter & Poppins (modern, clean)
- **Dyslexia-Friendly**: Comic Sans with increased spacing

### Text Size
- Use A+ and A- buttons to adjust text size (12px - 32px)
- Settings persist across sessions

### Screen Reader Support
- Full ARIA labels
- Semantic HTML structure
- Keyboard navigation support

---

## 📁 Project Structure

```
SE/
├── index.html              # Landing page with OAuth buttons
├── dashboard.html          # Main dashboard with gamification
├── quiz.html              # AI-powered quiz system
├── lesson_player.html     # Lesson viewer
├── profile.html           # User profile
├── parent_dashboard.html  # Parent monitoring
├── register.html          # Registration page
├── style.css              # Modern design system
├── animations.css         # Keyframe animations
├── script.js              # Core functionality + MockBackend
├── gamification.js        # XP, levels, badges system
├── auth-config.js         # OAuth configuration
└── TESTING_GUIDE.txt      # Original testing guide
```

---

## 🐛 Troubleshooting

### OAuth Not Working
**Issue**: Microsoft/Google buttons don't work  
**Solution**: OAuth requires proper Client IDs. Either:
1. Set up OAuth credentials (see setup guide above)
2. Use traditional login: `student` / `password123`

### No Visual Changes
**Issue**: Interface looks the same  
**Solution**: 
1. Hard refresh: `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac)
2. Clear browser cache
3. Make sure you're opening `index.html` from the SE folder

### Gamification Not Showing
**Issue**: XP/badges not visible  
**Solution**:
1. Log in with `student` / `password123`
2. Check browser console for errors (F12)
3. Make sure all JS files are loaded

### Animations Not Working
**Issue**: No smooth animations  
**Solution**:
1. Check if `animations.css` is linked in the HTML
2. Try a different browser (Chrome, Edge, Firefox recommended)
3. Disable "reduce motion" in OS accessibility settings

---

## 🎯 Testing Checklist

### ✅ UI/UX
- [x] Modern gradient design visible
- [x] Smooth animations on page load
- [x] Hover effects on cards and buttons
- [x] Responsive on mobile/tablet
- [x] Theme switching works (Light/Dark/High Contrast)
- [x] Font size adjustment works

### ✅ Gamification
- [x] XP displayed on dashboard
- [x] Level and title shown correctly
- [x] Streak counter visible
- [x] Badges section present
- [x] Progress bar to next level
- [x] Activity feed updates

### ✅ Authentication
- [x] Traditional login works
- [x] OAuth buttons visible (even if not configured)
- [x] Logout functionality
- [x] Session persistence

### ✅ Learning Features
- [x] Courses display with progress
- [x] Gradient course cards
- [x] Lesson navigation
- [x] AI quiz generation
- [x] Progress tracking

---

## 🚀 Next Steps

### Completed ✅
- Modern UI with gradients and animations
- Gamification system (XP, levels, badges, streaks)
- OAuth integration framework
- Dashboard with stats and activity feed
- Enhanced accessibility features

### To Do 📝
- Quiz page enhancements with celebration animations
- Interactive exercise types (flashcards, matching games)
- Mobile app version
- More course content
- Social features (leaderboards, friend system)

---

## 💡 Tips for Best Experience

1. **Use Chrome or Edge** for best compatibility
2. **Enable JavaScript** in browser settings
3. **Allow localStorage** for data persistence
4. **Try all themes** to find your preference
5. **Test on different screen sizes**
6. **Complete lessons to see gamification in action**

---

## 📞 Support

For issues or questions:
1. Check browser console (F12) for errors
2. Clear cache and reload
3. Try different browser
4. Ensure all files are in the same folder

---

## 🎉 Enjoy Learning!

Start your journey by logging in and exploring the beautiful new interface!

**Default Login**: `student` / `password123`
