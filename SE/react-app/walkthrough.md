# Sprint 2 — Walkthrough

## 1. Bug Fixes (5 Critical Issues Resolved)

| # | Bug | Fix | File |
|---|-----|-----|------|
| 1 | Admin can't delete users | Changed delete route middleware from [admin](file:///c:/Users/yerne/Downloads/SE%20%28222%29/SE%20%2812%29/SE%20%2812%29/SE/SE/react-app/backend/utils/authMiddleware.js#27-34) → [adminOrTeacher](file:///c:/Users/yerne/Downloads/SE%20%28222%29/SE%20%2812%29/SE%20%2812%29/SE/SE/react-app/backend/utils/authMiddleware.js#35-42) | [userRoutes.js](file:///c:/Users/yerne/Downloads/SE%20(222)/SE%20(12)/SE%20(12)/SE/SE/react-app/backend/routes/userRoutes.js) |
| 2 | Course save/delete fails | Added dual-lookup: try `findById` first, fallback to `findOne({ id })` | [courseController.js](file:///c:/Users/yerne/Downloads/SE%20(222)/SE%20(12)/SE%20(12)/SE/SE/react-app/backend/controllers/courseController.js) |
| 3 | Guardian "requires backend" alert | Removed `MockBackend`, implemented real `userAPI.toggleChildLock()` | [GuardianDashboard.jsx](file:///c:/Users/yerne/Downloads/SE%20(222)/SE%20(12)/SE%20(12)/SE/SE/react-app/src/pages/GuardianDashboard.jsx) |
| 4 | Quiz voice stuck recording | Fixed callback parameter mismatch + added 8s auto-stop timeout | [Quiz.jsx](file:///c:/Users/yerne/Downloads/SE%20(222)/SE%20(12)/SE%20(12)/SE/SE/react-app/src/pages/Quiz.jsx) |
| 5 | Speech practice stuck | Added 10s auto-stop, interim transcript fallback on manual stop | [SpeechPractice.jsx](file:///c:/Users/yerne/Downloads/SE%20(222)/SE%20(12)/SE%20(12)/SE/SE/react-app/src/pages/SpeechPractice.jsx) |

---

## 2. Production Readiness

render_diffs(file:///c:/Users/yerne/Downloads/SE%20(222)/SE%20(12)/SE%20(12)/SE/SE/react-app/backend/server.js)

Added dynamic CORS with `FRONTEND_URL` env var for production deployment.

---

## 3. CI/CD Pipeline

Created [ci.yml](file:///c:/Users/yerne/Downloads/SE%20(222)/SE%20(12)/SE%20(12)/SE/SE/react-app/.github/workflows/ci.yml) — GitHub Actions workflow that:
- Triggers on push/PR to `main`
- Tests with Node 18.x and 20.x
- Installs frontend + backend deps
- Runs Vitest, builds frontend

### How to Set Up CI/CD on GitHub:
1. Push code to GitHub: `git add . && git commit -m "Sprint 2" && git push`
2. Go to **repo → Settings → Secrets → Actions**
3. Add `MONGO_URI`, `JWT_SECRET`, `VITE_API_URL`
4. The [.github/workflows/ci.yml](file:///c:/Users/yerne/Downloads/SE%20%28222%29/SE%20%2812%29/SE%20%2812%29/SE/SE/react-app/.github/workflows/ci.yml) automatically runs on every push/PR

---

## 4. Documentation HTML

Created [docs.html](file:///c:/Users/yerne/Downloads/SE%20(222)/SE%20(12)/SE%20(12)/SE/SE/react-app/docs.html) (48KB) with **11 tabs**:

| Tab | Content |
|-----|---------|
| API Reference | 26 endpoints — Auth, Users, Courses, Forum, Announcements |
| User Guide | 4 roles, features list, test accounts table |
| Developer Guide | Tech stack, env variables, setup instructions |
| Architecture | Three-tier system architecture (Mermaid) |
| Database Diagram | ER diagram for all 4 MongoDB collections |
| Project Structure | Full directory tree with descriptions |
| **Class Diagram** | 15+ classes with attributes, methods, relationships |
| **Use Case Diagram** | 10 actors, 32 use cases across 6 categories |
| **Sequence Diagrams** | Login+MFA flow, Course Progress+Gamification, Forum Post |
| **Activity Diagram** | Full user journey from Registration → Achievement |
| **Object Diagram** | Runtime instance snapshot with relationships |

Open by double-clicking [docs.html](file:///c:/Users/yerne/Downloads/SE%20%28222%29/SE%20%2812%29/SE%20%2812%29/SE/SE/react-app/docs.html) or via `npx serve .` → [/docs.html](file:///c:/Users/yerne/Downloads/SE%20%28222%29/SE%20%2812%29/SE%20%2812%29/SE/SE/react-app/docs.html)

---

## 5. Test Runner HTML

Created [test-runner.html](file:///c:/Users/yerne/Downloads/SE%20(222)/SE%20(12)/SE%20(12)/SE/SE/react-app/test-runner.html) (22KB) with **27 tests** across **4 suites**:

| Suite | Tests | Coverage |
|-------|-------|----------|
| 🔬 Unit | 8 | Validation, auth, empty fields, invalid tokens |
| 🔗 Integration | 10 | Register→Login→Profile, Courses, Progress, Forum, Stats |
| 🔁 Regression | 7 | Duplicate registration, RBAC, CRUD lifecycle |
| 🌍 E2E | 4 | Full user journeys: student, teacher, admin, parent |

**To run**: Open [test-runner.html](file:///c:/Users/yerne/Downloads/SE%20%28222%29/SE%20%2812%29/SE%20%2812%29/SE/SE/react-app/test-runner.html), ensure backend is running on port 5002, click **▶ Run All Tests**.

---

## 6. Deployment Guide

### Backend → Render
1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repo → set **Root Directory**: `backend`
3. **Build Command**: `npm install`
4. **Start Command**: `node server.js`
5. **Environment Variables**:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = your secret key
   - `PORT` = `5002`
   - `FRONTEND_URL` = `https://your-app.vercel.app`

### Frontend → Vercel
1. Go to [vercel.com](https://vercel.com) → **Import Project**
2. Connect your GitHub repo → set **Root Directory**: `.` (project root)
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Environment Variables**:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`

### Post-Deployment
1. Open Render Shell → run `node seed.js` to seed the database
2. Verify all 4 roles can login at the Vercel URL
