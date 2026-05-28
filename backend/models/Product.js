import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: {
    type: String,
    required: true,
    enum: ['Groceries', 'Dairy & Eggs', 'Beverages', 'Snacks & Namkeen', 'Personal Care', 'Home Care', 'Baby Products', 'Bakery & Sweets', 'Frozen Foods', 'Gifting', 'Fresh Fruits & Vegetables', 'Staples'],
  },
  price: { type: Number, required: true, min: 0 },
  mrp: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, default: 0, min: 0 },
  unit: { type: String, default: 'piece' },
  images: [{ url: String, public_id: String }],
  isActive: { type: Boolean, default: true },
  tags: [String],
  views: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
