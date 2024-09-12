import express from 'express';
import {
  fetchCommentsByArticleId,
  postCommentByArticleId,
  patchComment,
  deleteComment,
} from '../controllers/comments';

const router = express.Router();

router
  .route('/article/:article_id')
  .get(fetchCommentsByArticleId)
  .post(postCommentByArticleId);

router
  .route('/:comment_id')
  .patch(patchComment)
  .delete(deleteComment);

export default router;
