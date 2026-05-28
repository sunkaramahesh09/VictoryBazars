import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  district: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  timing: { type: String, default: '9:00 AM – 9:00 PM' },
  isActive: { type: Boolean, default: true },
  mapLink: { type: String },
  coordinates: { lat: Number, lng: Number },
}, { timestamps: true });

export default mongoose.model('Branch', branchSchema);
