import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String,
  status: String,
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    await mongoose.connect('mongodb+srv://vishal_db_user:Vishal_2003@dynamicdynamicservitech.k1xhnhv.mongodb.net/dynamicdynamicservitechdb');

    // Check admin
    const exists = await User.findOne({ email: 'admin@dynamicservitech.com' });
    if (exists) {
      console.log('Admin exists!');
      process.exit();
    }

    // Create admin (password will be hashed by backend)
    await User.create({
      username: 'admin',
      email: 'admin@dynamicservitech.com',
      password: 'Admin@1234', // Will be hashed by schema
      role: 'admin',
      status: 'active',
    });

    console.log('✅ Admin Created!');
    process.exit();
  } catch (e) {
    console.error('Error:', e.message);
    process.exit();
  }
}

createAdmin();
