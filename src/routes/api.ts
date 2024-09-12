import { Router, Request, Response } from 'express';
import topicsRouter from './topicsRouter';
import articlesRouter from './articlesRouter';
import commentsRouter from './commentsRouter';
import usersRouter from './usersRouter';
import { endPoints } from '../endpoints';

const router = Router();

router.use('/topics', topicsRouter);
router.use('/articles', articlesRouter);
router.use('/comments', commentsRouter);
router.use('/users', usersRouter);

router.get('/', (_req: Request, res: Response) => {
  res.status(200).json(endPoints);
});

export default router;
