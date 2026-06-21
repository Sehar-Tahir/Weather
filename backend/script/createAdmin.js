// backend/script/createAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');

dotenv.config();

const createSuperAdmin = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅ MongoDB Connected Successfully');

    const email = 'samaiqatanvir@gmail.com';
    const password = 'samaiqa321';
    const name = 'Samai Qatanvir';

    const existing = await Admin.findOne({ email });

    if (existing) {
      console.log('✅ Super Admin already exists');
      process.exit(0);
    }

    const admin = new Admin({
      email,
      password,
      name,
      role: 'superadmin',
      permissions: {
        stories: true,
        blogs: true,
        media: true,
        manageAdmins: true,
        manageSettings: true
      },
      isActive: true
    });

    await admin.save();

    console.log('\n🎉 Super Admin Created Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email    : ${email}`);
    console.log(`🔑 Password : ${password}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Try these solutions:');
      console.log('   1. Use VPN');
      console.log('   2. Use direct connection string (not SRV)');
      console.log('   3. Check your internet connection');
    }
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createSuperAdmin();