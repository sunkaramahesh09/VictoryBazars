import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, required: true },
  position: {
    type: String,
    required: true,
    enum: ['Store Manager', 'Assistant Manager', 'Cashier', 'Sales Associate', 'Inventory Staff', 'Security Guard', 'Housekeeping', 'Delivery Staff', 'IT Support', 'Accountant', 'HR Executive'],
  },
  branchPreference: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  resumeUrl: { type: String },
  resumePublicId: { type: String },
  coverLetter: { type: String },
  status: { type: String, enum: ['applied', 'reviewing', 'shortlisted', 'rejected', 'hired'], default: 'applied' },
}, { timestamps: true });

export default mongoose.model('JobApplication', jobApplicationSchema);
