import { Router } from 'express';

const router = Router();

// GET /user/profile
router.get('/profile', (req, res) => {
  res.json({ message: 'Get user profile - to be implemented' });
});

// PUT /user/profile
router.put('/profile', (req, res) => {
  res.json({ message: 'Update user profile - to be implemented' });
});

export default router; 