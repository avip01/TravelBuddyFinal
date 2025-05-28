import { Router } from 'express';

const router = Router();

router.get('/:flightNumber', (req, res) => {
  res.json({ message: 'Flight info - to be implemented' });
});

export default router; 