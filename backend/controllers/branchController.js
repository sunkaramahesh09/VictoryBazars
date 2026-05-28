import asyncHandler from 'express-async-handler';
import Branch from '../models/Branch.js';

// @desc  Get all branches
// @route GET /api/branches
export const getBranches = asyncHandler(async (req, res) => {
  const query = { isActive: true };
  if (req.query.district) query.district = { $regex: req.query.district, $options: 'i' };
  const branches = await Branch.find(query).sort({ district: 1, name: 1 });
  res.json({ success: true, branches });
});

// @desc  Get single branch
// @route GET /api/branches/:id
export const getBranchById = asyncHandler(async (req, res) => {
  const branch = await Branch.findById(req.params.id);
  if (!branch) { res.status(404); throw new Error('Branch not found'); }
  res.json({ success: true, branch });
});

// @desc  Create branch (admin)
// @route POST /api/branches
export const createBranch = asyncHandler(async (req, res) => {
  const branch = await Branch.create(req.body);
  res.status(201).json({ success: true, branch });
});

// @desc  Update branch (admin)
// @route PUT /api/branches/:id
export const updateBranch = asyncHandler(async (req, res) => {
  const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!branch) { res.status(404); throw new Error('Branch not found'); }
  res.json({ success: true, branch });
});

// @desc  Delete branch (admin)
// @route DELETE /api/branches/:id
export const deleteBranch = asyncHandler(async (req, res) => {
  const branch = await Branch.findByIdAndDelete(req.params.id);
  if (!branch) { res.status(404); throw new Error('Branch not found'); }
  res.json({ success: true, message: 'Branch deleted' });
});

// @desc  Get districts list
// @route GET /api/branches/districts
export const getDistricts = asyncHandler(async (_req, res) => {
  const districts = await Branch.distinct('district', { isActive: true });
  res.json({ success: true, districts: districts.sort() });
});
