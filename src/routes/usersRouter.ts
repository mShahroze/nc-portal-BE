import { Router } from 'express';
import {
  fetchUsers,
  postUser,
  fetchUserByUsername,
} from '../controllers/users';
import { handle405 } from '../errors';

const router = Router();

router.route('/').get(fetchUsers).post(postUser).all(handle405);

router.route('/:username').get(fetchUserByUsername).all(handle405);

export default router;
