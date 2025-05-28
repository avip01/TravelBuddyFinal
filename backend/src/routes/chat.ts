import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Chat endpoints - to be implemented' });
});

export default router; 