# Quick Start Guide

Get PepperUni running in 5 minutes!

## Prerequisites Check

- ✅ Node.js installed (`node --version`)
- ✅ npm installed (`npm --version`)
- ✅ MongoDB connection string ready
- ✅ OpenAI API key ready

## Step-by-Step Setup

### 1. Backend Setup (2 minutes)

```bash
cd backend
npm install
```

Create `backend/.env` file:
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_random_secret_key_here
OPENAI_API_KEY=your_openai_api_key_here
CORS_ORIGIN=http://localhost:3000
```

Start backend:
```bash
npm start
```

You should see: `Server running on http://localhost:5001` and `MongoDB connected`

### 2. Frontend Setup (2 minutes)

Open a new terminal:
```bash
cd app
npm install
npm start
```

The frontend will open at `http://localhost:3000`

### 3. Test the Application (1 minute)

1. Go to `http://localhost:3000`
2. Click through to sign up
3. Create an account
4. Login
5. Upload a PDF resume
6. Enter job details
7. Get AI-tailored resume!

## Common Issues

### Backend won't start
- Check if port 5001 is available
- Verify `.env` file exists and has all required variables
- Check MongoDB connection string

### Frontend won't connect to backend
- Ensure backend is running on port 5001
- Check `CORS_ORIGIN` in backend `.env` matches frontend URL

### MongoDB connection error
- Verify connection string is correct
- Check network access (for Atlas)
- Ensure MongoDB service is running (for local)

## Need Help?

- See `SETUP.md` for detailed setup instructions
- See `MONGODB_SETUP.md` for MongoDB connection guide
- Check backend console for error messages

## Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `5001` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | Secret key for JWT tokens | `mySuperSecretKey123!` |
| `OPENAI_API_KEY` | Your OpenAI API key | `sk-...` |
| `CORS_ORIGIN` | Frontend URL | `http://localhost:3000` |

## API Endpoints

- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Login
- `POST /api/main_job` - Upload resume and get AI analysis
- `POST /api/resumes/edit-resume` - Edit resume with AI

## File Upload

- Supported formats: PDF, DOC, DOCX
- Maximum file size: 50MB
- Files are automatically deleted after processing

