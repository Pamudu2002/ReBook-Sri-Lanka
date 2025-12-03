# Production Deployment Guide

## 🚀 Deploying ReBook Sri Lanka to Production

This guide covers deploying your application to production using Vercel (recommended) or other platforms.

## Option 1: Deploy to Vercel (Recommended)

Vercel is the recommended platform as it's created by the Next.js team.

### Prerequisites
- GitHub account
- Vercel account (free at [vercel.com](https://vercel.com))
- MongoDB Atlas account (free at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas))

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: ReBook Sri Lanka"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ReBook-Sri-Lanka.git
   git push -u origin main
   ```

2. **Set Up MongoDB Atlas**
   - Go to [MongoDB Atlas](https://mongodb.com/cloud/atlas)
   - Create a free cluster
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

3. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure environment variables (see below)
   - Click "Deploy"

4. **Configure Environment Variables in Vercel**
   
   Go to Project Settings → Environment Variables and add:
   
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rebook
   JWT_SECRET=your-random-secure-jwt-secret-min-32-chars
   NEXTAUTH_SECRET=your-random-secure-nextauth-secret-min-32-chars
   NEXTAUTH_URL=https://your-domain.vercel.app
   ADMIN_EMAIL=admin@rebook.lk
   ADMIN_PASSWORD=YourSecureAdminPassword123!
   ```

   **⚠️ Security Notes:**
   - Use long, random strings for JWT_SECRET and NEXTAUTH_SECRET
   - Change the default admin password
   - Never commit `.env.local` to Git

5. **Create Admin User**
   
   After deployment, create the admin user:
   - Use Vercel's terminal or run locally with production MongoDB URI
   - Or create admin manually through MongoDB Atlas interface

## Option 2: Deploy to Other Platforms

### Deploy to Railway

1. **Push to GitHub** (same as above)

2. **Go to [railway.app](https://railway.app)**

3. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

4. **Add MongoDB**
   - Click "New" → "Database" → "Add MongoDB"
   - Railway will provision MongoDB automatically

5. **Configure Environment Variables**
   - Add all variables from `.env.example`
   - Use Railway's MongoDB connection string

6. **Deploy**
   - Railway will auto-deploy on git push

### Deploy to DigitalOcean App Platform

1. **Push to GitHub**

2. **Create App on DigitalOcean**
   - Go to App Platform
   - Create new app from GitHub
   - Select your repository

3. **Configure Build Settings**
   - Build Command: `npm run build`
   - Run Command: `npm start`

4. **Add MongoDB**
   - Use DigitalOcean's managed MongoDB
   - Or connect to MongoDB Atlas

5. **Set Environment Variables**

6. **Deploy**

## 🔒 Security Checklist for Production

- [ ] Change default admin credentials
- [ ] Use strong, random JWT secrets (min 32 characters)
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set up MongoDB Atlas IP whitelist (or allow all for serverless)
- [ ] Enable MongoDB authentication
- [ ] Review and test all API endpoints
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Configure CORS if needed
- [ ] Set up backup strategy for MongoDB
- [ ] Add rate limiting for API routes
- [ ] Enable MongoDB Atlas backups

## 📊 Post-Deployment Steps

1. **Test All Features**
   - Student submission
   - Donor registration
   - Admin approval flow
   - Language switching
   - Mobile responsiveness

2. **Create Initial Admin User**
   ```bash
   # If using MongoDB Atlas
   # Update your local .env.local with production MONGODB_URI
   npm run setup:admin
   ```

3. **Monitor Application**
   - Check Vercel Analytics
   - Monitor MongoDB Atlas metrics
   - Set up alerts for errors

4. **Optional Enhancements**
   - Custom domain
   - Email notifications (using SendGrid, Resend, etc.)
   - SMS notifications (using Twilio)
   - Image uploads for requirements
   - Admin analytics dashboard
   - Export data to CSV

## 🔧 Environment Variables Reference

```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/rebook

# Authentication
JWT_SECRET=min-32-char-random-string-here
NEXTAUTH_SECRET=another-32-char-random-string
NEXTAUTH_URL=https://your-domain.com

# Admin Account
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=SecurePassword123!
```

## 📱 Domain Setup (Optional)

### Using Custom Domain on Vercel

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update NEXTAUTH_URL environment variable

### SSL Certificate

SSL is automatically provided by Vercel. For other platforms:
- Let's Encrypt (free)
- Cloudflare SSL

## 🐛 Troubleshooting Production Issues

### MongoDB Connection Errors
- Check connection string format
- Verify IP whitelist (use 0.0.0.0/0 for serverless)
- Ensure database user has correct permissions

### Build Failures
- Check all dependencies are in `package.json`
- Verify TypeScript types are correct
- Review build logs in platform dashboard

### Runtime Errors
- Check environment variables are set
- Review server logs
- Test API routes individually

## 📈 Scaling Considerations

As your application grows:

1. **Database Optimization**
   - Add indexes for frequently queried fields
   - Enable MongoDB Atlas auto-scaling
   - Consider sharding for large datasets

2. **Performance**
   - Enable Next.js Image Optimization
   - Use CDN for static assets
   - Implement caching strategies

3. **Monitoring**
   - Set up application monitoring (Datadog, New Relic)
   - Enable logging (Winston, Pino)
   - Track user analytics

## 🆘 Support

For deployment issues:
- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Next.js Deployment: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- MongoDB Atlas: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)

---

**Good luck with your deployment! 🚀**
