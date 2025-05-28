import { Router } from 'express';

const router = Router();

// GET /trips
router.get('/', (req, res) => {
  res.json({ message: 'Get trips - to be implemented' });
});

// POST /trips
router.post('/', (req, res) => {
  res.json({ message: 'Create trip - to be implemented' });
});

export default router; 