# Nespak Internal Digital Learning & Knowledge Platform (LMS)

An **enterprise-grade internal web application** for NESPAK employees to access training materials, capacity-building resources, organizational preferences, and project-related documents.

This platform centralizes **learning, documentation, and feedback collection** in a secure environment with role-based access (Admins / Viewers).

---

## 🚀 Features

- **Dashboard with 4 sections**:

  - Trainings & Development
  - Nespak Representation
  - Nespak Preferences
  - Project-Related Documents

- **For Admins**

  - Upload YouTube video training links
  - Upload supporting PDF slides
  - Tag content with multiple categories (speaker, topic, department, etc.)
  - View analytics (user activity, uploads, progress)
  - Manage and review feedback

- **For Viewers**

  - Browse and search content by title, section, tag, or speaker
  - Watch embedded YouTube training videos
  - Download PDF slides
  - Track learning progress
  - Submit feedback & ratings

- **Security & Tracking**

  - JWT authentication with email verification
  - Role-based access control
  - User activity logging (views, timestamps, progress %)
  - Feedback system with admin moderation

---

## 🏗️ Tech Stack

### Backend

- **Node.js + Express.js** – REST API
- **Microsoft SQL Server** – Relational database
- **mssql** – SQL driver
- **JWT Authentication** – Secure sessions
- **bcrypt** – Password hashing

### Frontend

- **React.js + TypeScript** – UI framework
- **Tailwind CSS + shadcn/ui** – Styling & UI components
- **React Router DOM** – Client-side routing
- **react-youtube** – Embedded video player
- **Axios** – API calls

---

## 🗄️ Database Design (MSSQL)

Core tables:

- **Users** → employee accounts, roles, authentication
- **PendingVerifications** → email verification codes
- **Sections** → dashboard categories
- **Content** → uploaded videos/slides metadata
- **Tags** + **ContentTags** → flexible tagging system
- **Views** → user activity + progress tracking
- **Feedback** → user ratings and suggestions
- **Requests** → external access requests system

Indexes added for performance: content title, tags, views, feedback status, etc.

---

## 📂 Folder Structure

```
Nespak-LMS-App/
│── backend/              # Node.js + Express + SQL Server
│   ├── controllers/      # Business logic
│   ├── routes/           # API routes
│   ├── middleware/       # JWT, role protection
│   ├── utils/            # Helpers
│   ├── uploads/          # PDF storage
│   ├── db.js             # DB connection
│   ├── server.js         # Entry point
│   └── .env              # Backend environment variables
│
│── frontend/             # React + Tailwind + shadcn/ui
│   ├── public/           # Static assets
│   ├── src/              # Components, pages, hooks
│   ├── App.tsx           # Root component
│   ├── main.tsx          # Entry point
│   └── .env              # Frontend environment variables
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

```env
# Server configuration
PORT=your_server_port_number

# Database configuration (Microsoft SQL Server)
DB_USER=your_sql_server_username
DB_PASSWORD=your_sql_server_password
DB_SERVER=your_sql_server_host\instance_name
DB_DATABASE=your_sql_server_database_name

# Authentication & Security
JWT_SECRET=your_random_jwt_secret_key
BASE_URL=your_backend_base_url   # e.g. http://localhost:5000

# Email service (for verification emails)
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password

# File uploads
UPLOADS_DIR=your_uploads_directory_name

```

### Frontend (`frontend/.env`)

```env
# The base URL of your backend API
VITE_API_BASE_URL=your_backend_base_url   # e.g. http://localhost:5000
```

---

## ▶️ Running the App (Development)

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/nespak-lms-app.git
   cd nespak-lms-app
   ```

2. **Setup Backend**

   ```bash
   cd backend
   npm install
   npm run dev
   ```

   Runs on [http://localhost:5000](http://localhost:5000)

3. **Setup Frontend**
   Open a new terminal:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Runs on [http://localhost:5173](http://localhost:5173)

---

## 📊 API Overview

| Method | Endpoint             | Role   | Description                             |
| ------ | -------------------- | ------ | --------------------------------------- |
| POST   | `/api/auth/register` | Public | Register user + send email verification |
| POST   | `/api/auth/verify`   | Public | Verify email                            |
| POST   | `/api/auth/login`    | Public | Login & issue JWT                       |
| GET    | `/api/content`       | All    | Fetch content (filters supported)       |
| POST   | `/api/content`       | Admin  | Upload new content (YouTube + PDF)      |
| PUT    | `/api/content/:id`   | Admin  | Edit content                            |
| DELETE | `/api/content/:id`   | Admin  | Soft delete content                     |
| POST   | `/api/feedback`      | Viewer | Submit feedback                         |
| GET    | `/api/feedback`      | Admin  | Review feedback                         |
| GET    | `/api/dashboard`     | Admin  | Analytics overview                      |

---

## 📱 Frontend Features

- Responsive UI (desktop, tablet, mobile)
- Role-based dashboards (Admin vs Viewer)
- Embedded YouTube video player with progress tracking
- Slide viewer + PDF download
- Content filtering (tags, speaker, section)
- Feedback submission with ratings
- Toast notifications for user interactions

---

## 🔒 Security Highlights

- JWT-based authentication with expiration
- Email verification at signup
- Passwords hashed with bcrypt
- Role-based route protection
- File validation (PDF only for slides, YouTube link validation for videos)
- Soft-delete for recoverable content management

---

## 📌 Future Enhancements

- Comments & discussion threads
- Assignments & quizzes
- Advanced analytics dashboards
- Activating the **Requests Module**

---

## 👩‍💻 Contributors

- **Asra Bukhari** – Developer (Backend + Frontend)
- NESPAK IT Team – Supervisors

---

✨ This project is designed for **NESPAK internal use only** and is not publicly accessible.

---
