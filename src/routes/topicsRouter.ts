import express from 'express';
import * as topicsController from '../controllers/topics';

const router = express.Router();

router
  .route('/')
  .get(topicsController.fetchTopics)
  .post(topicsController.postTopic)
  .all((req, res) => {
    res.status(405).json({ msg: 'Method Not Allowed' });
  });

router
  .route('/:slug')
  .get(topicsController.fetchTopicBySlug)
  .all((req, res) => {
    res.status(405).json({ msg: 'Method Not Allowed' });
  });

export default router;
