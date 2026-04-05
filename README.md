# 📋 Smart Task Manager

**A modern, feature-rich task management application built with HTML, CSS, and vanilla JavaScript.**

Plan smarter. Execute faster.

---

## 📌 Overview

**Smart Task Manager** is an intelligent productivity application designed to help users organize, prioritize, and manage their tasks efficiently. With a clean, modern interface and powerful features, it enables users to stay focused on their goals and track their productivity in real-time.

The application is built entirely with vanilla JavaScript and localStorage-based storage, making it lightweight, fast, and perfect for personal task management.

---

## 👥 User Roles

### 1. **Individual User / Personal Productivity Manager**
   - **Description:** A single user who manages their own tasks and productivity
   - **Responsibilities:**
     - Create, edit, and delete tasks
     - Monitor task progress through dashboard metrics
     - Schedule tasks efficiently
     - Track productivity through analytics
     - Manage personal profile and settings

---

## ✨ Features & Descriptions

### 🏠 **Dashboard**
- **Real-time Metrics:** Display today's tasks, pending items, completed tasks, and current streak
- **Progress Tracking:** Visual progress bar showing task completion percentage
- **Today's Plan:** View all tasks due today with quick access
- **Smart Suggestions:** AI-like scheduling recommendations based on task priority and estimated time
- **Morning Greeting:** Personalized greeting with current date and motivational message

### 📝 **Task Management**
- **Create Unlimited Tasks:** Add new tasks with comprehensive details
- **Task Details:**
  - Title and description
  - Priority levels (High, Medium, Low)
  - Due dates with calendar picker
  - Status (Pending, In Progress, Completed)
  - Categories and custom tags
  - Notes and attachments
  - Estimated completion time
  
- **Task Actions:**
  - Edit existing tasks
  - Mark as complete with one click
  - Delete tasks
  - Search tasks by keyword
  - Multi-criteria filtering (priority, status, category, deadline)

### 📅 **Calendar View**
- **Monthly Calendar Grid:** Navigate through months easily
- **Visual Task Indicators:** Color-coded dots showing task priority
- **Weekly Board:** Drag-and-drop interface for rescheduling tasks
- **Mobile-Friendly Swipe Gestures:** Quick actions on mobile devices

### 📊 **Analytics & Insights**
- **Daily Productivity Score:** Track daily task completion percentages
- **Weekly Overview:** See your performance trends
- **Completion Pie Chart:** Visual representation of completed vs. pending tasks
- **Daily Bar Chart:** View tasks completed per day
- **Productivity Insights:** Data-driven suggestions for improvement

### 🎯 **Smart Scheduling**
- **Time Slot Suggestions:** AI-powered recommendations for task scheduling
- **Task Breakdown Generator:** Automatically suggest subtasks and steps
- **Time Estimation:** Smart calculation based on task complexity
- **Conflict Detection:** Alerts when scheduling conflicts arise
- **Context-Aware Suggestions:** Different recommendations for study, work, and project tasks

### 🔔 **Notifications**
- **Real-Time Alerts:** Notification badge shows pending and overdue task count
- **Interactive Notification Panel:** Click bell icon to see all notifications
- **Task Categorization:**
  - 🟡 Due Today (Yellow/Warning)
  - 🔴 Overdue (Red/Danger)
- **Quick Navigation:** Click notifications to jump to task list

### 👤 **Profile Management**
- **User Profile Settings:**
  - Full name
  - Email address (read-only)
  - Password management
  - Age information
  
- **Profile Picture:**
  - Upload custom profile image
  - Edit and delete profile picture
  - Default avatar placeholder
  
- **Settings Management:**
  - Enable/disable notifications
  - Theme selection (Light/Dark mode)
  - Language preferences

### 🌙 **Dark Mode**
- **Toggle Dark/Light Theme:** Switch between themes instantly
- **Eye-Friendly Design:** Optimized colors for reduced eye strain
- **Persistent Settings:** Theme choice saved in localStorage
- **Smooth Transitions:** Beautiful color transitions when switching themes

### 🔐 **Authentication**
- **User Registration:**
  - Email-based account creation
  - Password protection (minimum 6 characters)
  - Email uniqueness validation
  
- **Secure Login:**
  - Session-based authentication
  - Automatic session validation
  - Logout functionality
  
- **Session Management:**
  - Persistent session storage
  - Automatic redirect on authentication failure

### 🏷️ **Organization Features**
- **Categories:** Organize tasks by type (Work, Personal, Study, etc.)
- **Custom Tags:** Create and apply multiple tags to tasks
- **Search Functionality:** Find tasks instantly by keyword
- **Advanced Filtering:** Filter by priority, status, category, and deadline

### 📎 **Attachments & Notes**
- **Task Notes:** Add detailed notes to any task
- **Attachment Support:** Link files or references to tasks
- **URL References:** Attach important links to tasks

---

## 🎨 User Interface Highlights

### **Modern Design System**
- Clean, card-based layout
- Gradient branding colors (Blue to Green)
- Smooth animations and transitions
- Professional typography (Manrope font)

### **Responsive Design**
- Mobile-first approach
- Touch-friendly interface
- Swipe gestures for quick actions
- Optimized for desktop, tablet, and mobile

### **Navigation**
- Sidebar navigation with 6 main sections
- Quick action buttons (Dashboard only topbar)
- Mobile-friendly menu
- Sticky header for easy access

---

## 💻 Technology Stack

| Technology | Purpose |
|-----------|---------|
| **HTML5** | Semantic markup and structure |
| **CSS3** | Modern styling with CSS variables and Grid/Flexbox |
| **Vanilla JavaScript (ES6+)** | Dynamic functionality without frameworks |
| **localStorage API** | Persistent data storage |
| **SVG** | Scalable vector graphics for logos and icons |

---

## 📂 Project Structure

```
Smart Task Manager/
├── index.html              # Main app shell (6 views)
├── login.html              # Login page with authentication
├── register.html           # Registration page
├── style.css               # Complete styling system
├── script.js               # Main application logic
├── auth.js                 # Authentication handler
└── README.md              # This file
```

---

## 🚀 Getting Started

### **1. Open the Application**
Simply open `login.html` in your web browser to start.

### **2. Create an Account**
- Click "Create Account" on the login page
- Enter your full name, email, and password (minimum 6 characters)
- Click "Register"

### **3. Login**
- Enter your registered email and password
- You'll be redirected to the dashboard

### **4. Start Managing Tasks**
- Click "Dashboard" to see your overview
- Click "Add Task" to create your first task
- Use other sections to explore features

---

## 📋 Main Screen Sections

### **Dashboard (View)**
- Metrics cards
- Progress bar
- Today's plan
- Smart suggestions

### **Task List**
- All tasks with search and filters
- Quick edit/complete/delete options
- Category and tag visualization

### **Add Task**
- Comprehensive form with all task details
- Smart scheduling suggestions
- Task breakdown generator
- Time estimation

### **Calendar**
- Monthly view with task indicators
- Weekly drag-and-drop board
- Month navigation

### **Analytics**
- Daily/weekly productivity scores
- Completion charts and graphs
- Task distribution insights

### **Settings**
- Profile management with image upload
- Notification preferences
- Theme selection
- Language settings

---

## 🔐 Data Privacy & Storage

- **No Backend Server:** All data stored locally in browser
- **localStorage-based:** Data persists across sessions
- **User-Specific Storage:** Tasks isolated by email
- **Password Storage:** Stored locally (no encryption in current implementation)

---

## 📱 Features by Device

### **Desktop Experience**
- Full-featured sidebar navigation
- Multi-column layouts
- Drag-and-drop weekly board
- Rich typography

### **Mobile Experience**
- Touch-optimized buttons
- Swipe gestures for actions
- Stacked single-column layout
- Full-height modals
- Simplified navigation

---

## 🎯 Key Metrics & Tracking

- **Completion Rate:** Percentage of tasks completed
- **Task Streak:** Consecutive days with completed tasks
- **Productivity Insights:** Daily and weekly performance
- **Task Distribution:** Breakdown by priority and category

---

## 🔄 Smart Features Deep Dive

### **Smart Scheduling**
```
Input: Task title and description
Process: Analyze complexity and suggest optimal time
Output: "Try scheduling between 8 AM - 10 AM"
```

### **Time Estimation**
```
Input: Task details and priority
Process: Algorithm based on task complexity
Output: "Estimated 45 minutes"
```

### **Task Breakdown**
```
Input: High-priority task
Process: Context-aware step generation
Output: Suggested subtasks and milestones
```

---

## ⌨️ Keyboard Shortcuts & Actions

- **Quick Add Task:** Click "Quick Add Task" button on dashboard
- **View Notifications:** Click bell icon in topbar
- **Toggle Theme:** Click theme toggle button (🌙/☀️)
- **Navigate Sections:** Use sidebar buttons
- **Search Tasks:** Type in filter section

---

## 🙋 FAQ

**Q: Where is my data stored?**  
A: All your data is stored locally in your browser's localStorage. No server sync.

**Q: Can I sync across devices?**  
A: Not in the current version. Each device has its own local storage.

**Q: Is my password secure?**  
A: Passwords are stored in localStorage. For a production app, use proper backend authentication.

**Q: Can I export my tasks?**  
A: Not in the current version, but you can take screenshots or notes.

**Q: Does it work offline?**  
A: Yes! The app works completely offline using localStorage.

---

## 🎓 Learning Resources

This project demonstrates:
- Modern vanilla JavaScript (ES6+ features)
- CSS Grid and Flexbox layouts
- localStorage API usage
- Form handling and validation
- State management patterns
- Responsive web design
- SVG icon implementation
- Event-driven programming

---

## 🔮 Future Enhancements

- Backend API integration
- Cloud data sync
- Real-time notifications
- Collaboration features
- Task templates
- Time tracking
- Recurring tasks
- Email reminders
- Team features
- Mobile app version

---

## 📄 License

This project is created as a learning/personal productivity tool.

---

## 👨‍💼 Author

Created with ❤️ for better productivity management.

**Version:** 1.0.0  
**Last Updated:** April 2026

---

**Start organizing your tasks and boost your productivity today! 🚀**
