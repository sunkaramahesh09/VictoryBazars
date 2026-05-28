import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import { cloudinary } from "../config/cloudinary.js";

// @desc  Get all products (with filters, search, pagination)
// @route GET /api/products
export const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;
  const query = { isActive: true };
  if (req.query.category) query.category = req.query.category;
  if (req.query.search)
    query.name = { $regex: req.query.search, $options: "i" };
  if (req.query.featured) query.isFeatured = true;
  const sort =
    req.query.sort === "price_asc"
      ? { price: 1 }
      : req.query.sort === "price_desc"
        ? { price: -1 }
        : req.query.sort === "newest"
          ? { createdAt: -1 }
          : { isFeatured: -1, createdAt: -1 };
  const [products, total] = await Promise.all([
    Product.find(query).sort(sort).skip(skip).limit(limit),
    Product.countDocuments(query),
  ]);
  res.json({
    success: true,
    products,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

// @desc  Get single product
// @route GET /api/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  product.views += 1;
  await product.save();
  const similar = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true,
  }).limit(4);
  res.json({ success: true, product, similar });
});

// @desc  Create product (admin)
// @route POST /api/products
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

// @desc  Update product (admin)
// @route PUT /api/products/:id
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json({ success: true, product });
});

// @desc  Delete product (admin)
// @route DELETE /api/products/:id
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.images?.length) {
    await Promise.all(
      product.images.map(
        (img) => img.public_id && cloudinary.v2.uploader.destroy(img.public_id),
      ),
    );
  }
  await product.deleteOne();
  res.json({ success: true, message: "Product deleted" });
});

// @desc  Upload product images (admin)
// @route POST /api/products/:id/images
export const uploadProductImages = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    console.log(
      "uploadProductImages - req.files:",
      Array.isArray(req.files)
        ? req.files.map((f) => ({
            originalname: f.originalname,
            path: f.path,
            filename: f.filename,
          }))
        : req.files,
    );
    const files = req.files || [];
    const newImages = files.map((f) => ({
      url: f.path,
      public_id: f.filename,
    }));
    product.images.push(...newImages);
    await product.save();
    res.json({ success: true, images: product.images });
  } catch (err) {
    console.error("uploadProductImages error:", err);
    // preserve original status if set by earlier checks
    if (res.headersSent) return;
    res
      .status(res.statusCode === 200 ? 500 : res.statusCode)
      .json({ success: false, message: err.message });
  }
});

// @desc  Delete a single product image (admin)
// @route DELETE /api/products/:id/images/:publicId
export const deleteProductImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  const publicId = decodeURIComponent(req.params.publicId);
  // Remove from Cloudinary
  try {
    await cloudinary.v2.uploader.destroy(publicId);
  } catch (_) {
    /* ignore if already gone */
  }
  // Remove from product images array
  product.images = product.images.filter((img) => img.public_id !== publicId);
  await product.save();
  res.json({ success: true, images: product.images });
});

// @desc  Get all categories
// @route GET /api/products/categories
export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Product.distinct("category", { isActive: true });
  res.json({ success: true, categories });
});

// @desc  Get all products for admin (includes inactive)
// @route GET /api/products/admin/all
export const getAdminProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const [products, total] = await Promise.all([
    Product.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments({}),
  ]);
  res.json({
    success: true,
    products,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});
