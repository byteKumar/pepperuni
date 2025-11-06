# PepperUni Setup Guide

This guide will help you set up and run the PepperUni application locally.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)
- OpenAI API Key

## Setup Steps

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
OPENAI_API_KEY=your_openai_api_key_here
CORS_ORIGIN=http://localhost:3000
```

**Important:** Replace the placeholder values with your actual credentials.

### 2. Frontend Setup

Navigate to the app directory:
```bash
cd app
```

Install dependencies:
```bash
npm install
```

### 3. MongoDB Connection

#### Option A: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new cluster (free tier available)
4. Click "Connect" on your cluster
5. Choose "Connect your application"
6. Copy the connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`)
7. Replace `<password>` with your database password
8. Replace `<dbname>` with your database name (e.g., `pepperuni`)
9. Add this connection string to your `.env` file as `MONGODB_URI`

#### Option B: Local MongoDB

1. Install MongoDB locally from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   - **macOS/Linux:** `mongod`
   - **Windows:** Start MongoDB service from Services
3. Use connection string: `mongodb://localhost:27017/pepperuni`
4. Add this to your `.env` file as `MONGODB_URI`

### 4. Running the Application

#### Start Backend Server

In the `backend` directory:
```bash
npm start
# or
node server.js
```

The server should start on `http://localhost:5001`

#### Start Frontend Development Server

In a new terminal, navigate to the `app` directory:
```bash
cd app
npm start
```

The frontend should start on `http://localhost:3000`

### 5. Application Flow

1. **Landing Page** (`/`): Shows PepperUni branding, then redirects to signup
2. **Sign Up** (`/signup`): Create a new account
3. **Login** (`/login`): Sign in with your credentials
4. **Resume Upload** (`/resumeupload`): Upload your resume (PDF) and enter job details
5. **Response** (`/response`): View AI-tailored resume with score and analysis

## Environment Variables Explained

- `PORT`: Backend server port (default: 5001)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation (use a strong random string)
- `OPENAI_API_KEY`: Your OpenAI API key (get it from [OpenAI Platform](https://platform.openai.com/api-keys))
- `CORS_ORIGIN`: Frontend URL (default: http://localhost:3000)

## Troubleshooting

### Backend Issues

1. **MongoDB Connection Error:**
   - Verify your `MONGODB_URI` is correct
   - Check if MongoDB is running (for local installation)
   - Ensure network access is allowed (for MongoDB Atlas)

2. **OpenAI API Error:**
   - Verify your `OPENAI_API_KEY` is valid
   - Check your OpenAI account has sufficient credits

3. **Port Already in Use:**
   - Change `PORT` in `.env` file
   - Or stop the process using port 5001

### Frontend Issues

1. **Cannot Connect to Backend:**
   - Ensure backend is running on port 5001
   - Check `CORS_ORIGIN` in backend `.env`
   - Verify API endpoints in components match backend routes

2. **CORS Errors:**
   - Make sure `CORS_ORIGIN` in backend `.env` matches your frontend URL

## File Structure

```
PepperUni-main/
├── backend/
│   ├── controllers/     # Request handlers
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── services/       # Business logic (PDF extraction)
│   ├── middleware/    # Auth middleware
│   ├── uploads/        # Temporary file storage (auto-created)
│   ├── server.js       # Entry point
│   └── .env           # Environment variables (create this)
├── app/
│   ├── src/
│   │   ├── components/ # React components
│   │   └── App.js     # Main app component
│   └── package.json
└── service/            # Python reference implementation
```

## Notes

- The `uploads` directory is automatically created when you upload a file
- Uploaded files are automatically deleted after processing
- Resume data is stored in MongoDB with user association
- JWT tokens expire after 1 day

## Security Notes

- Never commit `.env` files to git
- Use strong JWT secrets in production
- Keep your OpenAI API key secure
- Regularly rotate API keys and secrets

