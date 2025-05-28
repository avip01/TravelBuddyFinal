import { Router } from 'express';

const router = Router();

// POST /auth/signup
router.post('/signup', (req, res) => {
  res.json({ message: 'Signup endpoint - to be implemented' });
});

// POST /auth/login
router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint - to be implemented' });
});

// POST /auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout endpoint - to be implemented' });
});

// POST /auth/refresh
router.post('/refresh', (req, res) => {
  res.json({ message: 'Refresh token endpoint - to be implemented' });
});

export default router; 