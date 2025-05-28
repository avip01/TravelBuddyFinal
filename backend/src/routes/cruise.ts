import { Router } from 'express';

const router = Router();

router.get('/:shipId', (req, res) => {
  res.json({ message: 'Cruise info - to be implemented' });
});

export default router; 