import express from 'express';
import { applyJob, getApplications, updateApplicationStatus } from '../controllers/careerController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();
router.post('/apply', upload.single('resume'), applyJob);
router.get('/', protect, admin, getApplications);
router.put('/:id/status', protect, admin, updateApplicationStatus);
export default router;
