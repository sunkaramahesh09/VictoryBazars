import express from 'express';
import { getBranches, getBranchById, createBranch, updateBranch, deleteBranch, getDistricts } from '../controllers/branchController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/districts', getDistricts);
router.get('/', getBranches);
router.get('/:id', getBranchById);
router.post('/', protect, admin, createBranch);
router.put('/:id', protect, admin, updateBranch);
router.delete('/:id', protect, admin, deleteBranch);
export default router;
