# 🎓 College Placement Hub

<div align="center">

### 🚀 Full-Stack Placement Management System for Engineering Colleges

A modern campus recruitment platform that connects **Students**, **Recruiters**, **Placement Officers**, and **Administrators** through a secure, scalable, and intuitive web application.

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript)
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss)

**⭐ If you like this project, don't forget to Star the repository!**

</div>

---

# 📖 Overview

College Placement Hub is a **complete placement management platform** designed for engineering colleges. It streamlines the campus recruitment process by enabling secure collaboration between students, recruiters, placement officers, and administrators.

The project follows an **incremental development approach**, where every feature is implemented, type-checked, and production-build verified before moving to the next.

---

# ✨ Features

## 🔐 Authentication & Authorization

- JWT Authentication
- Refresh Token Authentication
- HTTP-Only Secure Cookies
- Role-Based Access Control (RBAC)
- Password Encryption using bcryptjs
- Protected Routes
- Secure Middleware

### Supported Roles

- 👨‍🎓 Student
- 🏢 Recruiter
- 👨‍💼 Placement Officer
- ⚙️ Administrator

---

## 🏢 Recruiter Portal

- Company Profile Management
- Create Job Postings
- Edit/Delete Jobs
- View Posted Jobs
- Approval Workflow
- Pending/Approved Status

---

## 🎓 Student Portal

- Academic Information
- Skills Management
- Resume Upload
- Projects
- Certifications
- Internships
- Achievements
- Eligibility Checker
- Browse Available Jobs

---

## 👨‍💼 Placement Officer

- Review Job Requests
- Approve Job Posts
- Reject Job Posts
- Manage Recruiters

---

## 🎨 Frontend

- React 19
- TypeScript
- Tailwind CSS
- Responsive Design
- Protected Routes
- Clean Dashboard UI
- Modern User Experience

---

# 🛠 Tech Stack

## Frontend

- React 19
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Axios

## Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Multer

---

# 📂 Project Structure

```
placement-hub/
│
├── backend/
│   ├── src/
│   ├── uploads/
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
│
└── README.md
```

---

# 🚀 Getting Started

## 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/placement-hub.git

cd placement-hub
```

---

## 2️⃣ Backend Setup

```bash
cd backend

cp .env.example .env

npm install

npm run dev
```

Server runs on

```
http://localhost:5000
```

---

## 3️⃣ Frontend Setup

Open another terminal

```bash
cd frontend

npm install

npm run dev
```

Application runs on

```
http://localhost:5173
```

---

# ⚙ Environment Variables

Create a `.env` file inside **backend**

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_ACCESS_SECRET=your_access_secret

JWT_REFRESH_SECRET=your_refresh_secret
```

---

# 👨‍💻 Application Workflow

### Recruiter

```
Register
      ↓
Create Company
      ↓
Post Job
      ↓
Wait For Approval
```

---

### Placement Officer

```
Login
      ↓
Review Jobs
      ↓
Approve / Reject
```

---

### Student

```
Register
      ↓
Complete Profile
      ↓
Upload Resume
      ↓
Browse Jobs
      ↓
Eligibility Check
```

---

# 📸 Screenshots

> Add screenshots here

```
Home Page

Dashboard

Student Profile

Recruiter Dashboard

Placement Officer Dashboard

Job Details

Eligibility Checker
```

---

# 📌 Current Progress

| Module | Status |
|---------|--------|
| Authentication | ✅ Completed |
| Role Management | ✅ Completed |
| Company Management | ✅ Completed |
| Job Management | ✅ Completed |
| Student Profile | ✅ Completed |
| Resume Upload | ✅ Completed |
| Eligibility Checker | ✅ Completed |
| Frontend UI | ✅ Completed |
| Applications | 🚧 In Progress |
| Admin Panel | 🔜 Planned |
| AI ATS Score | 🔜 Planned |
| Mock Interview | 🔜 Planned |
| Career Roadmap | 🔜 Planned |

---

# 🛣 Roadmap

### Phase 1 ✅

- Authentication
- Roles
- Company Management
- Job Management
- Student Profiles

### Phase 2 🚧

- Applications
- Recruiter Applicant Dashboard
- Application Status

### Phase 3

- Admin Dashboard
- Analytics
- Notifications
- Email Integration

### Phase 4

- AI Resume ATS Scoring
- AI Mock Interviews
- AI Career Roadmap
- Resume Suggestions

---

# 🔒 Security Features

- JWT Authentication
- Refresh Token Rotation
- Password Hashing
- HTTP-Only Cookies
- Role-Based Authorization
- Protected API Routes
- Input Validation

---

# 💡 Future Improvements

- Cloudinary Resume Storage
- Docker Support
- Automated Testing
- CI/CD Pipeline
- Email Verification
- Forgot Password
- Two-Factor Authentication
- Real-Time Notifications
- Analytics Dashboard

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository

2. Create your feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push to your branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# ⭐ Support

If you found this project useful:

⭐ Star this repository

🍴 Fork it

📢 Share it with others

---

# 📄 License

This project is licensed under the MIT License.

---

<div align="center">

## Made with ❤️ using React, TypeScript, Node.js & MongoDB

### ⭐ Star this Repository if you like it!

</div>
