import connectDB from '../lib/mongodb';
import Admin from '../models/Admin';

async function createAdmin() {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@rebook.lk';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = await Admin.create({
      email: adminEmail,
      password: adminPassword,
      name: 'System Administrator',
      role: 'super-admin',
    });

    console.log('Admin user created successfully!');
    console.log('Email:', admin.email);
    console.log('Password:', adminPassword);
    console.log('\nPlease change the default password after first login.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
