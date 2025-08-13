# ePathshala Frontend Documentation

## 📁 Project Structure Overview

```
epathshala-Web/
├── public/                          # Static assets
├── src/
│   ├── api/                        # API service functions
│   ├── assets/                     # Static assets (images, icons)
│   ├── components/                 # Reusable React components
│   │   ├── admin/                  # Admin-specific components
│   │   ├── chat/                   # Chat and messaging components
│   │   ├── common/                 # Shared/common components
│   │   ├── exam/                   # Exam-related components
│   │   ├── forum/                  # Forum components
│   │   ├── layout/                 # Layout and navigation components
│   │   ├── notifications/          # Notification components
│   │   ├── parent/                 # Parent-specific components
│   │   ├── student/                # Student-specific components
│   │   ├── teacher/                # Teacher-specific components
│   │   └── ui/                     # UI utility components
│   ├── hooks/                      # Custom React hooks
│   ├── pages/                      # Page components
│   │   ├── about/                  # About page
│   │   ├── auth/                   # Authentication pages
│   │   ├── contact/                # Contact page
│   │   └── dashboard/              # Dashboard pages
│   │       ├── parent/             # Parent dashboard pages
│   │       ├── student/            # Student dashboard pages
│   │       └── teacher/            # Teacher dashboard pages
│   ├── routes/                     # Routing configuration
│   ├── theme/                      # Material-UI theme configuration
│   └── utils/                      # Utility functions
├── package.json                    # Dependencies and scripts
└── vite.config.js                  # Vite configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
cd epathshala-Web
npm install
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🏗️ Core Architecture

### Technology Stack
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls

### Key Design Patterns
- **Component-Based Architecture** - Modular, reusable components
- **Context API** - State management (authentication, theme)
- **Custom Hooks** - Logic reusability
- **Responsive Design** - Mobile-first approach

## 📱 Components Documentation

### 1. Layout Components (`src/components/layout/`)

#### `Navbar.jsx`
**Location**: `src/components/common/Navbar.jsx`
**Purpose**: Main navigation bar with user menu and chatbot
**Key Features**:
- Responsive design with mobile menu
- User authentication status display
- Chatbot integration
- Role-based navigation links
- Profile menu with logout functionality

**Key Props**: `children` (for mobile menu button)
**Responsive Breakpoints**: 
- Mobile: Hamburger menu, condensed layout
- Desktop: Full navigation links, expanded layout

#### `Sidebar.jsx` (Legacy)
**Location**: `src/components/layout/Sidebar.jsx`
**Purpose**: Generic sidebar component (replaced by role-specific sidebars)

#### Role-Specific Sidebars
- **`TeacherSidebar.jsx`** - Teacher dashboard navigation
- **`StudentSidebar.jsx`** - Student dashboard navigation  
- **`ParentSidebar.jsx`** - Parent dashboard navigation

**Features**:
- Collapsible menu sections
- Active link highlighting
- Role-specific menu items
- Mobile-responsive with temporary drawer

#### Dashboard Layouts
- **`TeacherDashboardLayout.jsx`** - Teacher dashboard wrapper
- **`StudentDashboardLayout.jsx`** - Student dashboard wrapper
- **`ParentDashboardLayout.jsx`** - Parent dashboard wrapper

**Features**:
- Sidebar integration
- Mobile drawer management
- Breadcrumb navigation
- Responsive container

### 2. Authentication Components (`src/pages/auth/`)

#### `LoginPage.jsx`
**Location**: `src/pages/auth/LoginPage.jsx`
**Purpose**: User authentication interface
**Key Features**:
- Multi-role login (Admin, Student, Teacher, Parent)
- Password visibility toggle
- Form validation
- Loading states
- Error handling
- Responsive design with welcome section

**Form Fields**:
- Email address (with email icon)
- Password (with visibility toggle)
- Role selection dropdown
- Forgot password link

#### `ForgotPassword.jsx`
**Location**: `src/pages/auth/ForgotPassword.jsx`
**Purpose**: Password reset functionality
**Key Features**:
- Two-step process (Request OTP → Reset Password)
- Stepper UI for progress indication
- OTP verification
- Password strength validation
- Responsive design

### 3. Dashboard Components

#### Overview Components (`src/components/dashboard/`)
- **`TeacherOverview.jsx`** - Teacher dashboard summary
- **`StudentOverview.jsx`** - Student dashboard summary
- **`ParentOverview.jsx`** - Parent dashboard summary

**Features**:
- Statistics cards with icons
- Recent activities list
- Quick action buttons
- Responsive grid layout

#### Dashboard Pages (`src/pages/dashboard/`)

##### Teacher Dashboard Pages
- **`TeacherDashboard.jsx`** - Main teacher overview
- **`TeacherAttendancePage.jsx`** - Attendance management
- **`TeacherGradesPage.jsx`** - Grade management
- **`TeacherAssignmentsPage.jsx`** - Assignment management
- **`TeacherLeaveRequestsPage.jsx`** - Leave request handling
- **`TeacherCalendarPage.jsx`** - Academic calendar
- **`TeacherOnlineClassesPage.jsx`** - Online class management
- **`TeacherExamsPage.jsx`** - Exam management

##### Student Dashboard Pages
- **`StudentDashboard.jsx`** - Main student overview
- **`StudentAssignmentsPage.jsx`** - Assignment viewing/submission
- **`StudentExamsPage.jsx`** - Exam taking interface
- **`StudentGradesPage.jsx`** - Grade viewing
- **`StudentAttendancePage.jsx`** - Attendance tracking
- **`StudentLeaveRequestsPage.jsx`** - Leave request submission
- **`StudentCalendarPage.jsx`** - Academic calendar

##### Parent Dashboard Pages
- **`ParentDashboard.jsx`** - Main parent overview
- **`ParentChildProgressPage.jsx`** - Child academic progress
- **`ParentLeaveApprovalsPage.jsx`** - Leave request approvals
- **`ParentCalendarPage.jsx`** - Academic calendar

### 4. Common Components (`src/components/common/`)

#### `Chatbot.jsx`
**Location**: `src/components/common/Chatbot.jsx`
**Purpose**: AI-powered chatbot interface
**Features**:
- Real-time chat interface
- Predefined question selection
- Message history
- Responsive design

#### `Breadcrumb.jsx`
**Location**: `src/components/common/Breadcrumb.jsx`
**Purpose**: Navigation breadcrumbs
**Features**:
- Dynamic breadcrumb generation
- Clickable navigation links
- Current page indication

#### `Notifications.jsx`
**Location**: `src/components/common/Notifications.jsx`
**Purpose**: Notification display component
**Features**:
- Real-time notifications
- Notification types (success, error, warning, info)
- Auto-dismiss functionality

### 5. UI Components (`src/components/ui/`)

#### `LoadingSpinner.jsx`
**Location**: `src/components/ui/LoadingSpinner.jsx`
**Purpose**: Loading indicator component
**Features**:
- Customizable size
- Centered positioning
- Smooth animation

#### `ErrorMessage.jsx`
**Location**: `src/components/ui/ErrorMessage.jsx`
**Purpose**: Error display component
**Features**:
- Error message formatting
- Retry functionality
- User-friendly error descriptions

#### `EmptyState.jsx`
**Location**: `src/components/ui/EmptyState.jsx`
**Purpose**: Empty state display
**Features**:
- Customizable illustrations
- Action buttons
- Descriptive text

### 6. Chat Components (`src/components/chat/`)

#### `Chat.jsx`
**Location**: `src/components/chat/Chat.jsx`
**Purpose**: Main chat interface
**Features**:
- Real-time messaging
- Message threading
- File attachments
- User status indicators

#### `RealTimeChat.jsx`
**Location**: `src/components/chat/RealTimeChat.jsx`
**Purpose**: WebSocket-based real-time chat
**Features**:
- WebSocket connection
- Message broadcasting
- Online user list
- Typing indicators

## 🔧 API Integration (`src/api/`)

### API Service Files
- **`auth.jsx`** - Authentication endpoints
- **`admin.jsx`** - Admin-specific API calls
- **`assignments.jsx`** - Assignment management
- **`attendance.jsx`** - Attendance tracking
- **`calendar.jsx`** - Academic calendar
- **`exams.jsx`** - Exam management
- **`grades.jsx`** - Grade management
- **`leave.jsx`** - Leave request handling
- **`session.jsx`** - Session management

### API Structure
```javascript
// Example API call structure
export const loginUser = async (credentials) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return await response.json();
  } catch (error) {
    throw new Error('Network error');
  }
};
```

## 🎨 Theming & Styling (`src/theme/`)

### `theme.js`
**Location**: `src/theme/theme.js`
**Purpose**: Material-UI theme configuration
**Features**:
- Custom color palette
- Typography settings
- Component style overrides
- Responsive breakpoints

### Responsive Design
- **Mobile-first approach**
- **Breakpoints**: xs (0px), sm (600px), md (900px), lg (1200px), xl (1536px)
- **Responsive props**: `sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}`

## 🛣️ Routing (`src/routes/`)

### `AppRoutes.jsx`
**Location**: `src/routes/AppRoutes.jsx`
**Purpose**: Application routing configuration
**Route Structure**:
```javascript
// Public routes
<Route path="/" element={<HomePage />} />
<Route path="/login" element={<LoginPage />} />
<Route path="/forgot-password" element={<ForgotPassword />} />

// Protected routes (role-based)
<Route path="/teacher/*" element={<TeacherDashboardLayout />} />
<Route path="/student/*" element={<StudentDashboardLayout />} />
<Route path="/parent/*" element={<ParentDashboardLayout />} />
<Route path="/admin/*" element={<AdminDashboardLayout />} />
```

## 🔐 Authentication (`src/utils/`)

### `auth.jsx`
**Location**: `src/utils/auth.jsx`
**Purpose**: Authentication context and utilities
**Features**:
- User authentication state management
- Token storage and validation
- Role-based access control
- Login/logout functionality

### `api.jsx`
**Location**: `src/utils/api.jsx`
**Purpose**: API utility functions
**Features**:
- Request/response interceptors
- Error handling
- Authentication headers
- Base URL configuration

## 🎯 Key Features by Role

### 👨‍🏫 Teacher Features
- **Attendance Management**: Mark student attendance
- **Grade Management**: Enter and update student grades
- **Assignment Management**: Create and manage assignments
- **Leave Request Handling**: Approve/reject student leave requests
- **Online Class Management**: Schedule and conduct online classes
- **Exam Management**: Create and manage exams

### 👨‍🎓 Student Features
- **Assignment Tracking**: View and submit assignments
- **Exam Taking**: Take online exams with timer
- **Grade Viewing**: Check academic performance
- **Attendance Tracking**: View attendance records
- **Leave Request Submission**: Submit leave requests
- **Calendar Access**: View academic calendar

### 👨‍👩‍👧‍👦 Parent Features
- **Child Progress Monitoring**: View academic performance
- **Leave Request Approval**: Approve child's leave requests
- **Calendar Access**: View academic events
- **Communication**: Chat with teachers

### 👨‍💼 Admin Features
- **User Management**: Manage all users (students, teachers, parents)
- **System Configuration**: Configure academic settings
- **Reports**: Generate system reports
- **Calendar Management**: Manage academic calendar

## 📱 Responsive Design Implementation

### Mobile-First Approach
```javascript
// Example responsive styling
sx={{
  fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
  padding: { xs: 2, sm: 3, md: 4 },
  display: { xs: 'block', md: 'flex' }
}}
```

### Breakpoint Usage
- **xs (0-599px)**: Mobile phones
- **sm (600-899px)**: Tablets
- **md (900-1199px)**: Small desktops
- **lg (1200-1535px)**: Large desktops
- **xl (1536px+)**: Extra large screens

## 🚀 Performance Optimizations

### Code Splitting
- Route-based code splitting
- Lazy loading of components
- Dynamic imports for heavy components

### Bundle Optimization
- Tree shaking for unused code
- Image optimization
- CSS minification
- Gzip compression

## 🧪 Testing Strategy

### Component Testing
- Unit tests for utility functions
- Component testing with React Testing Library
- Integration tests for API calls

### E2E Testing
- User flow testing
- Cross-browser compatibility
- Mobile responsiveness testing

## 🔧 Development Guidelines

### Code Style
- **ESLint** configuration for code quality
- **Prettier** for code formatting
- **Component naming**: PascalCase
- **File naming**: PascalCase for components, camelCase for utilities

### Component Structure
```javascript
// Standard component structure
import React from 'react';
import { /* MUI components */ } from '@mui/material';

function ComponentName({ prop1, prop2 }) {
  // State and hooks
  const [state, setState] = useState();
  
  // Event handlers
  const handleEvent = () => {
    // Logic
  };
  
  // Render
  return (
    <Box>
      {/* JSX */}
    </Box>
  );
}

export default ComponentName;
```

### State Management
- **Local State**: useState for component-specific state
- **Global State**: Context API for authentication and theme
- **Server State**: Custom hooks for API data

## 📚 Additional Resources

### Dependencies
- **React**: 18.x
- **Material-UI**: 5.x
- **React Router**: 6.x
- **Vite**: 4.x

### Documentation Links
- [Material-UI Documentation](https://mui.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

---

**Last Updated**: August 2024
**Version**: 1.0.0
**Maintainer**: ePathshala Development Team
