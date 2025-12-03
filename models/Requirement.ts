import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRequirement extends Document {
  studentName: string;
  age: number;
  school: string;
  grade: string;
  address: string;
  district: string;
  contactNumber: string;
  guardianName?: string;
  guardianContact?: string;
  items: {
    itemName: string;
    quantity: number;
    priority: 'high' | 'medium' | 'low';
  }[];
  additionalNotes?: string;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled' | 'open' | 'in-progress' | 'completed';
  donorId?: mongoose.Types.ObjectId;
  donorName?: string;
  submittedAt: Date;
  reviewedAt?: Date;
  fulfilledAt?: Date;
  rejectionReason?: string;
}

const RequirementSchema = new Schema<IRequirement>(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [5, 'Age must be at least 5'],
      max: [25, 'Age must be less than 25'],
    },
    school: {
      type: String,
      required: [true, 'School name is required'],
      trim: true,
    },
    grade: {
      type: String,
      required: [true, 'Grade is required'],
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
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },
    guardianName: {
      type: String,
      trim: true,
    },
    guardianContact: {
      type: String,
      trim: true,
    },
    items: [
      {
        itemName: {
          type: String,
          required: true,
          trim: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        priority: {
          type: String,
          enum: ['high', 'medium', 'low'],
          default: 'medium',
        },
      },
    ],
    additionalNotes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'open', 'in-progress', 'completed'],
      default: 'pending',
    },
    donorId: {
      type: Schema.Types.ObjectId,
      ref: 'Donor',
    },
    donorName: {
      type: String,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
    },
    fulfilledAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
RequirementSchema.index({ status: 1, submittedAt: -1 });
RequirementSchema.index({ district: 1, status: 1 });

const Requirement: Model<IRequirement> =
  mongoose.models.Requirement || mongoose.model<IRequirement>('Requirement', RequirementSchema);

export default Requirement;
