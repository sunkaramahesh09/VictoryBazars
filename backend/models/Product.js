import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: {
    type: String,
    required: true,
    enum: [
      'Dairy & Eggs',
      'Fresh Fruits & Vegetables',
      'Cold Drinks & Juices',
      'Snacks & Munchies',
      'Breakfast & Instant Food',
      'Bakery & Sweets',
      'Stationery & Books',
      'Staples',
      'Beverages',
      'Masala & Oils',
      'Fragrance',
      'Baby Care',
      'Pharmacy',
      'Cleaning Essentials',
      'Home Care',
      'Personal Care',
      'Pet Care',
      'Gifting',
      'Sauces & Spreads',
    ],
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
