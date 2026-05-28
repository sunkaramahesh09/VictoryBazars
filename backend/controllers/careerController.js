import asyncHandler from 'express-async-handler';
import JobApplication from '../models/JobApplication.js';

// @desc  Submit job application
// @route POST /api/careers/apply
export const applyJob = asyncHandler(async (req, res) => {
  const { name, email, phone, position, branchPreference, coverLetter } = req.body;
  const app = await JobApplication.create({
    name, email, phone, position, branchPreference, coverLetter,
    resumeUrl: req.file?.path || null,
    resumePublicId: req.file?.filename || null,
  });
  res.status(201).json({ success: true, message: 'Application submitted successfully!', application: app });
});

// @desc  Get all applications (admin)
// @route GET /api/careers
export const getApplications = asyncHandler(async (req, res) => {
  const apps = await JobApplication.find({}).populate('branchPreference', 'name city').sort({ createdAt: -1 });
  res.json({ success: true, applications: apps });
});

// @desc  Update application status (admin)
// @route PUT /api/careers/:id/status
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const app = await JobApplication.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!app) { res.status(404); throw new Error('Application not found'); }
  res.json({ success: true, application: app });
});
