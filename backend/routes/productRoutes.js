import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, uploadProductImages, deleteProductImage, getCategories, getAdminProducts } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();
router.get('/categories', getCategories);
router.get('/admin/all', protect, admin, getAdminProducts);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.post('/:id/images', protect, admin, upload.array('images', 5), uploadProductImages);
router.delete('/:id/images/:publicId', protect, admin, deleteProductImage);
export default router;
