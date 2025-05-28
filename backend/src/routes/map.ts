import { Router } from 'express';

const router = Router();

router.get('/markers', (req, res) => {
  res.json({ message: 'Map markers - to be implemented' });
});

export default router; 