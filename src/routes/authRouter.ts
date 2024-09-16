import express from 'express';
import { verifyToken } from '../middleware/auth';
import { login } from '../controllers/auth';

const router = express.Router();

router.post('/login', login);

router.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'Access granted to protected route',
    user: req.user,
  });
});

export default router;
