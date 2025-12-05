import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IPendingDonor extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  district: string;
  organization?: string;
  emailOTP: string;
  otpExpiry: Date;
  createdAt: Date;
}

const PendingDonorSchema = new Schema<IPendingDonor>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
    },
    organization: {
      type: String,
      trim: true,
    },
    emailOTP: {
      type: String,
      required: true,
    },
    otpExpiry: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 86400, // Auto-delete after 24 hours
    },
  }
);

// Hash password before saving
PendingDonorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Index for faster queries and auto-cleanup
PendingDonorSchema.index({ email: 1 });
PendingDonorSchema.index({ otpExpiry: 1 }, { expireAfterSeconds: 0 });

const PendingDonor: Model<IPendingDonor> =
  mongoose.models.PendingDonor || mongoose.model<IPendingDonor>('PendingDonor', PendingDonorSchema);

export default PendingDonor;
