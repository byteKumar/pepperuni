# PepperUni

<div align="center">

![PepperUni Logo](client/public/logo512.png)

**AI-Powered Resume Tailoring Platform**

*Craft personalized, job-specific resumes that stand out to employers*

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.9.1-47A248?logo=mongodb)](https://www.mongodb.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?logo=openai)](https://openai.com/)

[Features](#-features) • [Installation](#-installation) • [Documentation](#-documentation) • [Architecture](#-architecture) • [API Reference](#-api-reference)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**PepperUni** is a comprehensive web application designed to help students and job seekers create personalized, job-specific resumes. By leveraging AI technology (OpenAI GPT-4), the platform analyzes job descriptions and automatically tailors resumes to match specific role requirements, significantly improving the chances of landing interviews.

### Key Benefits

- ✨ **AI-Powered Tailoring**: Automatically customize resumes based on job descriptions
- 📊 **Resume Scoring**: Get instant feedback on how well your resume matches job requirements
- 📚 **Resume History**: Track your last 5 resume uploads with scores and analytics
- 🎨 **Modern UI/UX**: Beautiful, responsive interface with dark/light theme support
- 🔒 **Secure**: JWT-based authentication with password hashing
- 📱 **Responsive**: Fully responsive design for mobile, tablet, and desktop

---

## ✨ Features

### Core Features

1. **User Authentication**
   - Secure sign up and login with JWT tokens
   - Password hashing with bcrypt
   - Session management

2. **Resume Upload & Processing**
   - PDF file upload with validation
   - Automatic text extraction from PDFs
   - Support for multiple file formats (PDF, DOC, DOCX)
   - File size validation (max 50MB)

3. **AI-Powered Resume Tailoring**
   - Integration with OpenAI GPT-4 Turbo
   - Automatic resume customization based on job descriptions
   - Job title and company name tracking
   - Intelligent keyword matching

4. **Resume Scoring System**
   - Real-time score calculation (0-100)
   - Analysis of resume-job description alignment
   - Visual score display with color-coded feedback

5. **Resume Management**
   - Save up to 5 most recent resumes per user
   - Track resume scores and creation dates
   - View resume history with analytics
   - Download tailored resumes
   - Delete resume functionality

6. **User Profile Management**
   - Update personal information
   - Manage contact details (email, phone, LinkedIn, portfolio)
   - Password change functionality

7. **Modern UI/UX**
   - Dark/Light theme toggle with floating draggable button
   - Responsive design for all screen sizes
   - Smooth animations and transitions
   - Intuitive navigation with sidebar menu
   - Loading states and error handling

---

## 🛠 Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI framework |
| **React Router** | 6.28.0 | Client-side routing |
| **Axios** | 1.7.7 | HTTP client for API calls |
| **Lucide React** | 0.460.0 | Icon library |
| **Tailwind CSS** | 3.4.15 | Utility-first CSS framework |
| **React Context API** | Built-in | Theme management |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | Latest | Runtime environment |
| **Express.js** | 4.21.2 | Web framework |
| **MongoDB** | 8.9.1 | NoSQL database |
| **Mongoose** | 8.9.1 | MongoDB ODM |
| **JWT** | 9.0.2 | Authentication tokens |
| **bcrypt** | 5.1.1 | Password hashing |
| **Multer** | 1.4.5 | File upload handling |
| **pdf-parse** | 1.1.1 | PDF text extraction |
| **OpenAI API** | 4.77.0 | AI-powered resume tailoring |

### Development Tools

- **ESLint**: Code linting
- **Nodemon**: Development server auto-reload
- **dotenv**: Environment variable management

### Deployment

- **Render**: Backend and frontend hosting
- **MongoDB Atlas**: Cloud database
- **Git**: Version control

---

## 🏗 Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (React)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Login    │  │  SignUp  │  │  Upload  │  │  Profile │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         React Router (Client-side Routing)           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Axios (HTTP Client) + JWT Tokens             │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                  Server (Node.js/Express)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Express Middleware                      │   │
│  │  • CORS • Body Parser • JWT Auth • File Upload       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Auth       │  │   Resume     │  │   Profile    │      │
│  │  Controller  │  │  Controller  │  │  Controller   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Services Layer                            │   │
│  │  • PDF Extraction • OpenAI Integration • File Cleanup  │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌───────▼────────┐  ┌───────▼────────┐
│   MongoDB      │  │   OpenAI API   │  │  File Storage  │
│   (Database)   │  │  (AI Service)  │  │   (Temporary)  │
└────────────────┘  └────────────────┘  └────────────────┘
```

### Data Flow

```
User Uploads Resume
        │
        ▼
┌───────────────────┐
│  File Validation   │
│  (PDF/DOC/DOCX)    │
└─────────┬──────────┘
          │
          ▼
┌───────────────────┐
│  Text Extraction  │
│  (pdf-parse)       │
└─────────┬──────────┘
          │
          ▼
┌───────────────────┐
│  OpenAI API Call  │
│  (GPT-4 Turbo)     │
│  • Analyze JD      │
│  • Tailor Resume   │
│  • Calculate Score │
└─────────┬──────────┘
          │
          ▼
┌───────────────────┐
│  Save to MongoDB  │
│  • Original Text   │
│  • Tailored Text   │
│  • Score           │
│  • Metadata        │
└─────────┬──────────┘
          │
          ▼
┌───────────────────┐
│  Return to Client │
│  • Display Result  │
│  • Show Score      │
│  • Download Option │
└───────────────────┘
```

### Component Hierarchy

```
App
├── ThemeProvider
│   ├── Router
│   │   ├── Routes
│   │   │   ├── ResumeBuilder (Landing)
│   │   │   ├── Login
│   │   │   ├── SignUp
│   │   │   ├── ResumeUpload
│   │   │   │   └── SharedNavigation
│   │   │   ├── ResumeList (History)
│   │   │   │   └── SharedNavigation
│   │   │   ├── Profile
│   │   │   │   └── SharedNavigation
│   │   │   └── Response
│   │   │       └── SharedNavigation
│   │   └── FloatingThemeToggle
```

---

## 📁 Project Structure

```
PepperUni-main/
├── client/                          # Frontend React Application
│   ├── public/                      # Static assets
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── _redirects               # SPA routing for deployment
│   ├── src/
│   │   ├── components/             # React components
│   │   │   ├── SharedNavigation.js # Sidebar navigation
│   │   │   ├── Login.js           # Login page
│   │   │   ├── SignUp.js           # Sign up page
│   │   │   ├── ResumeBuilder.js   # Landing page
│   │   │   ├── ResumeUpload.js     # Resume upload form
│   │   │   ├── ResumeList.js       # Resume history
│   │   │   ├── Profile.js          # User profile
│   │   │   ├── Response.js         # AI response display
│   │   │   ├── FloatingThemeToggle.js # Theme toggle
│   │   │   └── *.css               # Component styles
│   │   ├── contexts/
│   │   │   └── ThemeContext.js     # Theme management
│   │   ├── config/
│   │   │   └── api.js              # API configuration
│   │   ├── App.js                  # Main app component
│   │   ├── App.css                 # Global styles
│   │   ├── index.js                # Entry point
│   │   └── index.css               # Base styles
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                          # Backend Node.js Application
│   ├── controllers/                 # Request handlers
│   │   ├── authController.js       # Authentication logic
│   │   ├── resumeController.js     # Resume processing
│   │   ├── editResumeController.js # Resume editing
│   │   └── profileController.js    # Profile management
│   ├── models/                      # MongoDB schemas
│   │   ├── User.js                 # User model
│   │   └── Resume.js               # Resume model
│   ├── routes/                      # API routes
│   │   ├── authRoutes.js           # Auth endpoints
│   │   ├── resumeRoutes.js         # Resume endpoints
│   │   ├── editResumeRoutes.js     # Edit endpoints
│   │   └── profileRoutes.js        # Profile endpoints
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT verification
│   ├── services/
│   │   └── pdfService.js           # PDF extraction
│   ├── uploads/                     # Temporary file storage
│   ├── server.js                    # Express server
│   └── package.json
│
├── README.md                        # This file
├── QUICK_START.md                  # Quick setup guide
├── SETUP.md                        # Detailed setup instructions
├── MONGODB_SETUP.md                # MongoDB configuration
├── IMPLEMENTATION_SUMMARY.md       # Implementation details
├── RENDER_REDIRECTS_SETUP.md       # Deployment guide
└── render.yaml                     # Render deployment config
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher) or **yarn**
- **MongoDB** (Atlas cloud or local installation)
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/PepperUni.git
   cd PepperUni
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables** (see [Configuration](#-configuration))

5. **Start the backend server**
   ```bash
   cd server
   npm start
   ```

6. **Start the frontend** (in a new terminal)
   ```bash
   cd client
   npm start
   ```

7. **Open your browser**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5001`

For detailed setup instructions, see [QUICK_START.md](./QUICK_START.md) or [SETUP.md](./SETUP.md).

---

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pepperuni?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars

# OpenAI API
OPENAI_API_KEY=sk-your-openai-api-key-here

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend Configuration

The frontend API base URL is configured in `client/src/config/api.js`. For production, update this to your backend URL.

### MongoDB Setup

For detailed MongoDB setup instructions (Atlas or local), see [MONGODB_SETUP.md](./MONGODB_SETUP.md).

---

## 📡 API Reference

### Authentication Endpoints

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "studentName": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user_id",
      "studentName": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token_here"
  }
}
```

#### Sign In
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user_id",
      "studentName": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token_here"
  }
}
```

### Resume Endpoints

#### Upload Resume
```http
POST /api/main_job
Content-Type: multipart/form-data
Authorization: Bearer {token}

Form Data:
- file: (PDF file)
- job_title: "Software Engineer"
- company: "Tech Corp"
- job_description: "Job description text..."
- user_id: "user_id"
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "extractedText": "Original resume text...",
    "editedResume": "AI-tailored resume text...",
    "score": "85",
    "resumeId": "resume_id"
  }
}
```

#### Get User Resumes
```http
GET /api/resumes/user/:user_id
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "resume_id",
      "job_title": "Software Engineer",
      "company": "Tech Corp",
      "score": "85",
      "created_date": "2024-01-15",
      "original_resume": "...",
      "resume": "..."
    }
  ]
}
```

#### Delete Resume
```http
DELETE /api/resumes/delete/:resume_id
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": "success",
  "message": "Resume deleted successfully"
}
```

### Profile Endpoints

#### Get Profile
```http
GET /api/profile/:user_id
Authorization: Bearer {token}
```

#### Update Profile
```http
PUT /api/profile/:user_id
Content-Type: application/json
Authorization: Bearer {token}

{
  "studentName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "linkedin": "linkedin.com/in/johndoe",
  "portfolio": "johndoe.com"
}
```

#### Change Password
```http
PUT /api/profile/:user_id/password
Content-Type: application/json
Authorization: Bearer {token}

{
  "currentPassword": "oldPassword",
  "newPassword": "newSecurePassword"
}
```

---

## 🗄 Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  studentName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String,
  linkedin: String,
  portfolio: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Resume Collection

```javascript
{
  _id: ObjectId,
  user_id: String (required),
  filename: String,
  job_title: String,
  company: String,
  job_description: String,
  original_resume: String,  // Original extracted text
  resume: String,            // AI-tailored text
  score: String,             // 0-100 score
  created_date: String       // ISO date string
}
```

### Indexes

- `users.email`: Unique index
- `resumes.user_id`: Index for faster queries
- `resumes.created_date`: Index for sorting

---

## 🚢 Deployment

### Render Deployment

The project includes a `render.yaml` configuration file for easy deployment on Render.

1. **Backend Deployment**
   - Connect your GitHub repository to Render
   - Render will automatically detect `render.yaml`
   - Configure environment variables in Render dashboard
   - Deploy the backend service

2. **Frontend Deployment**
   - Build the React app: `npm run build`
   - Deploy the `build/` folder as a static site
   - Configure redirects for SPA routing (see `_redirects` file)

For detailed deployment instructions, see [RENDER_REDIRECTS_SETUP.md](./RENDER_REDIRECTS_SETUP.md).

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5001
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
OPENAI_API_KEY=your_openai_api_key
CORS_ORIGIN=https://your-frontend-domain.com
```

---

## 💻 Development

### Running in Development Mode

**Backend:**
```bash
cd server
npm run dev  # Requires nodemon
```

**Frontend:**
```bash
cd client
npm start  # Runs on http://localhost:3000
```

### Code Structure Guidelines

- **Components**: Keep components focused and reusable
- **State Management**: Use React hooks (useState, useEffect, useContext)
- **API Calls**: Centralize in service files or use Axios interceptors
- **Styling**: Use inline styles with theme context for consistency
- **Error Handling**: Implement try-catch blocks and user-friendly error messages

### Testing

Currently, the project uses manual testing. Future improvements could include:
- Unit tests with Jest
- Integration tests with Supertest
- E2E tests with Cypress

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use consistent indentation (2 spaces)
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **OpenAI** for providing the GPT-4 API
- **MongoDB** for the database solution
- **React** team for the amazing framework
- **Lucide** for the beautiful icons

---

## 📞 Support

For issues, questions, or contributions:

- **Documentation**: Check the `docs/` folder and markdown files
- **Issues**: Open an issue on GitHub
- **Email**: [Your email here]

---

## 🗺 Roadmap

### Planned Features

- [ ] DOC/DOCX text extraction support
- [ ] Resume version history and comparison
- [ ] Email notifications
- [ ] Resume templates library
- [ ] PDF export functionality
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Resume sharing functionality
- [ ] Password reset functionality
- [ ] Email verification

### Known Limitations

- PDF files are fully supported; DOC/DOCX support is limited
- Maximum file size: 50MB
- JWT tokens expire after 1 day
- No password reset functionality (yet)
- No email verification (yet)

---

<div align="center">

**Made with ❤️ for job seekers**

[⬆ Back to Top](#pepperuni)

</div>
