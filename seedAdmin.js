import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin', 'service_engineer'], default: 'service_engineer' },
    status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    const adminExists = await User.findOne({ email: 'admin@dynamicservitech.com' });

    if (adminExists) {
      adminExists.status = 'active'; // Make sure status is active
      await adminExists.save();
      console.log('✅ Admin already exists, status set to active!');
    } else {
      const admin = new User({
        username: 'Vivek Kulkarni',
        email: 'admin@dynamicservitech.com',
        password: 'Admin@1234',
        role: 'admin',
        status: 'active',
      });

      await admin.save();

      console.log('✅ Admin Created Successfully!');
      console.log('Email: admin@dynamicservitech.com');
      console.log('Password: Admin@1234');
    }

    process.exit();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
