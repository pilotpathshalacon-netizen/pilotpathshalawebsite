# Pilot Pathshala Web Application

A desktop web application for the Pilot Pathshala learning platform, built with React and Tailwind CSS.

## Features

- **Authentication**: Register and login with email/password
- **Dashboard**: View learning progress, active programs, and today's tasks
- **Courses**: Browse and enroll in available courses
- **My Learning**: Track enrolled courses and progress
- **Tests**: Practice daily quizzes and exam focus tests
- **Notifications**: Stay updated with notifications
- **Profile**: View learning statistics and profile information
- **Settings**: Customize learning preferences

## Project Structure

```
web/
├── src/
│   ├── api/
│   │   └── client.js           # API client with all endpoints
│   ├── components/
│   │   ├── Layout.jsx          # Main layout with sidebar and header
│   │   └── CourseCard.jsx      # Course card component
│   ├── context/
│   │   ├── AuthContext.jsx     # Authentication context
│   │   └── NotificationContext.jsx  # Notifications context
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── CoursesPage.jsx
│   │   ├── MyLearningPage.jsx
│   │   ├── TestsPage.jsx
│   │   ├── NotificationsPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── SettingsPage.jsx
│   ├── App.jsx                 # Router and app setup
│   ├── main.jsx                # Entry point
│   └── index.css               # Tailwind styles
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Design System

The web app maintains consistency with the mobile app:
- **Primary Color**: #0f766e (Teal)
- **Accent Color**: #2563eb (Blue)
- **Font**: Poppins
- **Border Color**: #e5e7eb
- **Background**: #e8eaed

## Installation & Setup

```bash
# Navigate to web folder
cd web

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create a `.env` file in the `web` folder:

```
VITE_API_URL=http://10.152.189.156:5002/api
```

## Technology Stack

- React 18.2
- React Router 6
- Tailwind CSS 3.4
- Vite 5.2
- Lucide React (Icons)

## API Integration

The app connects to the same backend API as the mobile app. All API calls are centralized in `src/api/client.js` for easy maintenance.

## Authentication

- Token-based authentication stored in localStorage
- Automatic logout on token expiration
- Protected routes with PrivateRoute component
- Auth context for global state management

## Features by Page

### Dashboard
- View learning statistics
- See today's tasks
- Continue learning from last lesson
- Quick access to active programs

### Courses
- Browse all available courses
- Enroll in new courses
- View course details and duration

### My Learning
- View enrolled courses
- Track progress with progress bars
- Resume learning

### Tests
- Daily practice quizzes
- Exam focus mode
- Track test results

### Notifications
- View all notifications
- Mark as read
- Clear all notifications

### Profile
- View user information
- See learning statistics
- Track achievements

### Settings
- Toggle daily reminders
- Enable offline mode
- Configure exam focus strategy
- Access support contact information

## Future Enhancements

- Lesson detail page with video player
- Test questions interface
- Offline content download
- Dark mode support
- Mobile responsive improvements
- Real-time progress sync
