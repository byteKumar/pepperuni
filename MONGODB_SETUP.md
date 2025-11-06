# MongoDB Connection Setup Guide

This guide provides step-by-step instructions for connecting PepperUni to MongoDB.

## Option 1: MongoDB Atlas (Cloud - Recommended for Development)

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account (or sign in if you already have one)
3. Verify your email address

### Step 2: Create a Cluster

1. After logging in, click **"Create a Deployment"** or **"Build a Database"**
2. Select **"M0 FREE"** (Free tier) for development
3. Choose a cloud provider and region (select the closest to your location)
4. Click **"Create Deployment"**
5. Wait for the cluster to be created (takes 3-5 minutes)

### Step 3: Create Database User

1. In the **"Security"** section, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication method
4. Enter a username (e.g., `pepperuni_user`)
5. Click **"Autogenerate Secure Password"** or create your own
6. **IMPORTANT:** Save the password securely - you'll need it for the connection string
7. Under **"Database User Privileges"**, select **"Read and write to any database"**
8. Click **"Add User"**

### Step 4: Configure Network Access

1. In the **"Security"** section, click **"Network Access"**
2. Click **"Add IP Address"**
3. For development, click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
   - **Note:** For production, add only specific IP addresses for security
4. Click **"Confirm"**

### Step 5: Get Connection String

1. Click **"Connect"** on your cluster
2. Select **"Connect your application"**
3. Choose **"Node.js"** as the driver
4. Copy the connection string (it looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Update .env File

1. Open `backend/.env` file
2. Replace the connection string:
   ```
   MONGODB_URI=mongodb+srv://pepperuni_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/pepperuni?retryWrites=true&w=majority
   ```
   - Replace `YOUR_PASSWORD` with the password you created in Step 3
   - Replace `cluster0.xxxxx` with your actual cluster name
   - `pepperuni` is the database name (you can change this)

### Step 7: Test Connection

1. Start your backend server:
   ```bash
   cd backend
   npm start
   ```
2. You should see: `MongoDB connected`
3. If you see an error, check:
   - Password is correct (special characters might need URL encoding)
   - Network access is configured correctly
   - Connection string is complete

## Option 2: Local MongoDB Installation

### Step 1: Install MongoDB

#### macOS (using Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
```

#### Windows:
1. Download MongoDB from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB as a Windows Service

#### Linux (Ubuntu/Debian):
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

### Step 2: Start MongoDB Service

#### macOS:
```bash
brew services start mongodb-community
```

#### Windows:
- MongoDB should start automatically as a service
- Or start manually: `net start MongoDB`

#### Linux:
```bash
sudo systemctl start mongod
sudo systemctl enable mongod  # Enable auto-start on boot
```

### Step 3: Verify MongoDB is Running

```bash
mongosh
```

You should see the MongoDB shell. Type `exit` to exit.

### Step 4: Update .env File

1. Open `backend/.env` file
2. Add the connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/pepperuni
   ```
   - `localhost:27017` is the default MongoDB connection
   - `pepperuni` is the database name (you can change this)

### Step 5: Test Connection

1. Start your backend server:
   ```bash
   cd backend
   npm start
   ```
2. You should see: `MongoDB connected`

## Troubleshooting

### Connection String Issues

1. **Special Characters in Password:**
   - If your password has special characters, URL encode them:
   - `@` becomes `%40`
   - `#` becomes `%23`
   - `&` becomes `%26`
   - `%` becomes `%25`
   - Or use MongoDB Atlas's "Autogenerate Secure Password" feature

2. **Connection Timeout:**
   - Check your internet connection (for Atlas)
   - Verify network access is configured (for Atlas)
   - Check if MongoDB service is running (for local)

3. **Authentication Failed:**
   - Verify username and password are correct
   - Check if user has proper permissions
   - Ensure database name is correct

### MongoDB Atlas Specific Issues

1. **IP Whitelist:**
   - Make sure your current IP is whitelisted
   - Or use `0.0.0.0/0` for development (not recommended for production)

2. **Cluster Status:**
   - Ensure cluster is not paused (free tier pauses after 30 days of inactivity)
   - Click "Resume" if cluster is paused

### Local MongoDB Issues

1. **Service Not Starting:**
   - Check MongoDB logs: `/var/log/mongodb/mongod.log` (Linux)
   - Verify data directory exists and has proper permissions
   - Check if port 27017 is already in use

2. **Permission Denied:**
   - Ensure MongoDB user has proper permissions
   - Check file system permissions for data directory

## Environment Variable Format

Your `.env` file should look like this:

```env
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pepperuni?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
OPENAI_API_KEY=sk-your-openai-api-key-here
CORS_ORIGIN=http://localhost:3000
```

## Next Steps

After successfully connecting to MongoDB:

1. The application will automatically create collections when you:
   - Sign up a new user (creates `users` collection)
   - Upload a resume (creates `resumes` collection)

2. You can verify data in MongoDB:
   - **MongoDB Atlas:** Use the "Browse Collections" feature
   - **Local MongoDB:** Use `mongosh` or MongoDB Compass

3. The database structure will be:
   - `users` collection: User authentication data
   - `resumes` collection: Resume data with scores and analysis

## Security Best Practices

1. **Never commit `.env` file to git**
2. **Use strong passwords** for database users
3. **Limit IP access** in production (don't use `0.0.0.0/0`)
4. **Rotate passwords** regularly
5. **Use environment-specific connection strings** (dev, staging, production)

