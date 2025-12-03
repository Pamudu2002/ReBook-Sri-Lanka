# Quick Start Guide - ReBook Sri Lanka

## 🚀 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
1. Copy `.env.example` to `.env.local`
2. Update MongoDB connection string if needed
3. Change admin credentials (optional)

### Step 3: Set Up Database
Make sure MongoDB is running:
```bash
# Windows
net start MongoDB

# Or use MongoDB Atlas (cloud) by updating MONGODB_URI in .env.local
```

### Step 4: Create Admin User
```bash
npm run setup:admin
```

### Step 5: Start the Application
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🔐 Default Admin Credentials

```
Email: admin@rebook.lk
Password: Admin@123
```

**⚠️ Change these in production!**

## 📖 What to Do First

1. **Test Student Submission**
   - Go to home page → Click "Submit Requirements"
   - Fill the form and submit (no login needed)

2. **Login as Admin**
   - Go to Admin Login
   - Use the default credentials
   - Approve the test requirement

3. **Register as Donor**
   - Click "Become a Donor"
   - Register with your details
   - Login as admin and verify the donor

4. **Login as Donor**
   - Login with donor credentials
   - View approved requirements
   - See full details including contact info

## 🌐 Test Different Languages

Click the language buttons in the navigation bar:
- **English**
- **සිංහල** (Sinhala)
- **தமிழ்** (Tamil)

## 🆘 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `net start MongoDB`
- Or use MongoDB Atlas cloud connection string

### Admin User Already Exists
- Normal! Skip the admin creation step

### Port 3000 Already in Use
```bash
# Use a different port
npm run dev -- -p 3001
```

## 📚 Key Features to Test

✅ Student requirement submission (no login)
✅ Multi-language switching
✅ Donor registration with admin verification
✅ Admin dashboard for approvals
✅ Donor dashboard to view requirements
✅ Protected routes (try accessing dashboards without login)

## 🔗 Important URLs

- Home: http://localhost:3000
- Student Form: http://localhost:3000/student/submit
- Donor Registration: http://localhost:3000/donor/register
- Donor Login: http://localhost:3000/donor/login
- Admin Login: http://localhost:3000/admin/login

---

**Need help? Check the full README.md or open an issue on GitHub.**
