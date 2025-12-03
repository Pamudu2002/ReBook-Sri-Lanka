# ReBook Sri Lanka 📚

**Rebuilding Hope, One Book at a Time**

ReBook Sri Lanka is a web application designed to help flood-affected students in Sri Lanka get the stationery and educational materials they need. The platform connects students in need with generous donors through a simple, secure, and efficient system.

## 🌟 Features

### For Students
- **No Login Required**: Submit stationery requirements without creating an account
- **Simple Form**: Easy-to-use form to list needed items
- **Multi-language Support**: Available in English, Sinhala (සිංහල), and Tamil (தமிழ்)
- **Priority System**: Mark items by priority (high, medium, low)

### For Donors
- **Verified Registration**: Secure registration process with admin verification
- **Browse Requirements**: View all approved student requirements
- **Detailed Information**: Access complete student details after verification
- **Direct Contact**: Get contact information to arrange donations

### For Administrators
- **Review System**: Review and approve/reject student requirements
- **Donor Verification**: Verify donor registrations to ensure authenticity
- **Statistics Dashboard**: Monitor platform usage and impact
- **Complete Control**: Manage all aspects of the platform

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Pamudu2002/ReBook-Sri-Lanka.git
cd ReBook-Sri-Lanka
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the `.env.example` file to `.env.local`:

```bash
copy .env.example .env.local
```

Edit `.env.local` and configure your environment variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/rebook-sri-lanka

# JWT Secret for authentication (change this to a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000

# Admin Credentials (for initial setup)
ADMIN_EMAIL=admin@rebook.lk
ADMIN_PASSWORD=Admin@123
```

### 4. Set Up MongoDB

#### Option A: Local MongoDB
- Install MongoDB Community Edition
- Start MongoDB service:
  ```bash
  net start MongoDB
  ```

#### Option B: MongoDB Atlas (Cloud)
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a new cluster
- Get your connection string and update `MONGODB_URI` in `.env.local`

### 5. Initialize Admin User

Run the script to create the initial admin user:

```bash
npx tsx scripts/createAdmin.ts
```

This will create an admin account with the credentials specified in your `.env.local` file.

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage

### Student Flow
1. Visit the homepage
2. Click "Submit Requirements"
3. Fill out the form with required information
4. Submit (no login required)
5. Wait for admin approval

### Donor Flow
1. Click "Become a Donor" or "Donor Registration"
2. Register with your details
3. Wait for admin verification
4. Login after verification
5. Browse approved requirements
6. View full details and contact students

### Admin Flow
1. Go to Admin Login
2. Login with admin credentials
3. Review pending student requirements
4. Verify donor registrations
5. Monitor statistics

## 🌐 Language Support

The application supports three languages:
- **English**
- **Sinhala (සිංහල)**
- **Tamil (தமிழ்)**

Switch languages using the language selector in the navigation bar.

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected API routes
- Admin verification for donors
- Input validation and sanitization
- Environment variable protection

## 📁 Project Structure

```
ReBook-Sri-Lanka/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── admin/        # Admin endpoints
│   │   ├── donor/        # Donor endpoints
│   │   └── requirements/ # Requirements endpoints
│   ├── admin/            # Admin pages
│   ├── donor/            # Donor pages
│   ├── student/          # Student pages
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/            # Reusable components
│   └── Navbar.tsx        # Navigation bar
├── contexts/             # React contexts
│   ├── AuthContext.tsx   # Authentication context
│   └── LanguageContext.tsx # i18n context
├── lib/                  # Utility libraries
│   ├── mongodb.ts        # Database connection
│   ├── auth.ts          # Auth utilities
│   └── translations.ts   # Translation strings
├── models/               # Mongoose models
│   ├── Admin.ts
│   ├── Donor.ts
│   └── Requirement.ts
├── scripts/              # Utility scripts
│   └── createAdmin.ts    # Admin creation script
├── .env.local           # Environment variables (not in git)
├── .env.example         # Environment template
└── package.json         # Dependencies
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 👥 Contact

For questions or support, please open an issue on GitHub.

## 🙏 Acknowledgments

This project was created to support students affected by the devastating floods in Sri Lanka. Thank you to all donors and volunteers who help make a difference.

---

**Together, we can rebuild hope and education for affected students! 🌟**
